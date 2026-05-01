import {
  BadGatewayException,
  BadRequestException,
  Injectable,
  Logger,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  ImproveTextRequestDto,
  ImproveTextResponseDto,
} from './dto/improve-text.dto';
import {
  GeminiGenerateContentSuccess,
  NestleGeniaGenerateContentSuccess,
} from './ai.types';

type GenerateContentResponse =
  | GeminiGenerateContentSuccess
  | NestleGeniaGenerateContentSuccess;

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);
  private readonly publicErrorMessage =
    'No se pudo mejorar el texto en este momento.';
  private readonly textImprovementInstruction =
    'You are a Spanish copy editor for internal Nestle newsletters. Improve the text for clarity, fluency, tone, and readability while keeping the original meaning. Return only the improved text in Spanish, with no markdown, bullets, or explanations.';
  private readonly defaultNestleGeniaUrl =
    'https://eur-sdr-int-pub.nestle.com/api/dv-exp-sandbox-openai-api/1/genai/GCP/gemini-2.5-pro/generateContent';

  constructor(private readonly configService: ConfigService) {}

  async improveText(
    request: ImproveTextRequestDto,
  ): Promise<ImproveTextResponseDto> {
    const originalText = request.text?.trim();

    if (!originalText) {
      throw new BadRequestException(
        'El texto es requerido y no puede estar vacío',
      );
    }

    if (originalText.length > 3000) {
      throw new BadRequestException(
        'El texto debe tener 3000 caracteres o menos',
      );
    }

    if (this.readProvider() === 'nestle') {
      return this.improveWithNestleGenia(originalText);
    }

    return this.improveWithGemini(originalText);
  }

  private readEnv(key: string): string | null {
    const value = this.configService.get<string>(key)?.trim();
    return value ? value : null;
  }

  private readProvider(): 'gemini' | 'nestle' {
    return this.readEnv('AI_PROVIDER')?.toLowerCase() === 'nestle'
      ? 'nestle'
      : 'gemini';
  }

  private async improveWithGemini(
    originalText: string,
  ): Promise<ImproveTextResponseDto> {
    const apiKey = this.readEnv('GEMINI_API_KEY');
    const model =
      this.readEnv('GEMINI_MODEL') ??
      this.readEnv('GEMINI_TEXT_MODEL') ??
      'gemini-2.5-flash-lite';

    if (!apiKey) {
      throw new ServiceUnavailableException(
        'Gemini is not configured on the server.',
      );
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(this.buildGenerateContentPayload(originalText)),
        signal: AbortSignal.timeout(15000),
      },
    );

    const responseBody = (await response
      .json()
      .catch(() => null)) as GeminiGenerateContentSuccess | null;

    if (!response.ok) {
      throw this.createProviderException(
        'gemini',
        response.status,
        responseBody?.error?.message ??
          `Gemini returned status ${response.status}.`,
      );
    }

    return {
      originalText,
      improvedText: this.extractGeminiText(responseBody, model, 'gemini'),
      provider: 'gemini',
      model,
    };
  }

  private async improveWithNestleGenia(
    originalText: string,
  ): Promise<ImproveTextResponseDto> {
    const clientId = this.readEnv('CLIENT_ID');
    const clientSecret = this.readEnv('CLIENT_SECRET');
    const url = this.readEnv('NESTLE_GENIA_URL') ?? this.defaultNestleGeniaUrl;
    const model =
      this.readEnv('NESTLE_GENIA_MODEL') ?? this.extractNestleModelFromUrl(url);

    if (!clientId || !clientSecret) {
      throw new ServiceUnavailableException(
        'Nestle GenIA is not configured on the server.',
      );
    }

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        client_id: clientId,
        client_secret: clientSecret,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(this.buildGenerateContentPayload(originalText)),
      signal: AbortSignal.timeout(15000),
    });

    const responseBody = (await response
      .json()
      .catch(() => null)) as NestleGeniaGenerateContentSuccess | null;

    if (!response.ok) {
      throw this.createProviderException(
        'nestle',
        response.status,
        this.extractNestleErrorMessage(responseBody, response.status),
      );
    }

    return {
      originalText,
      improvedText: this.extractGeminiText(responseBody, model, 'nestle'),
      provider: 'nestle',
      model,
    };
  }

  private buildGenerateContentPayload(originalText: string): object {
    return {
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: `${this.textImprovementInstruction}\n\nText to improve:\n${originalText}`,
            },
          ],
        },
      ],
      generationConfig: {
        temperature: 0.4,
        topP: 0.8,
        topK: 40,
        maxOutputTokens: 300,
      },
      safetySettings: [
        {
          category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
          threshold: 'BLOCK_LOW_AND_ABOVE',
        },
      ],
    };
  }

  private extractNestleModelFromUrl(url: string): string {
    const match = url.match(/\/genai\/[^/]+\/([^/]+)\/generateContent$/);
    return match?.[1] ?? 'gemini-2.5-pro';
  }

  private extractNestleErrorMessage(
    responseBody: NestleGeniaGenerateContentSuccess | null,
    responseStatus: number,
  ): string {
    if (typeof responseBody?.error === 'string' && responseBody.error.trim()) {
      return responseBody.error.trim();
    }

    if (
      typeof responseBody?.error === 'object' &&
      responseBody.error?.message?.trim()
    ) {
      return responseBody.error.message.trim();
    }

    return `Nestle GenIA returned status ${responseStatus}.`;
  }

  private extractGeminiText(
    responseBody: GenerateContentResponse | null,
    model: string,
    provider: 'gemini' | 'nestle',
  ): string {
    const candidateText = responseBody?.candidates
      ?.flatMap((candidate) => candidate.content?.parts ?? [])
      .map((part) => part.text?.trim() ?? '')
      .find((text) => text.length > 0);

    if (candidateText) {
      return candidateText;
    }

    throw this.createProviderException(
      provider,
      502,
      `${provider === 'nestle' ? 'Nestle GenIA' : 'Gemini'} model ${model} did not return any text content.`,
    );
  }

  private createProviderException(
    provider: 'gemini' | 'nestle',
    providerStatus: number,
    providerError: string,
  ): BadGatewayException {
    this.logger.error(
      `AI improveText failed with provider=${provider} status=${providerStatus} error=${providerError}`,
    );

    return new BadGatewayException({
      message: this.publicErrorMessage,
      providerError,
      providerStatus,
      provider,
    });
  }
}
