import { ServiceUnavailableException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AiService } from './ai.service';

type ConfigValues = Record<string, string | undefined>;

function createConfigService(values: ConfigValues): ConfigService {
  return {
    get: (key: string) => values[key],
  } as ConfigService;
}

describe('AiService', () => {
  const originalFetch = global.fetch;

  afterEach(() => {
    global.fetch = originalFetch;
    jest.resetAllMocks();
  });

  it('throws when no provider credentials are configured', async () => {
    const service = new AiService(createConfigService({}));

    await expect(
      service.improveText({ text: 'Texto de prueba' }),
    ).rejects.toBeInstanceOf(ServiceUnavailableException);
  });

  it('improves text with Gemini by default when GEMINI_API_KEY exists', async () => {
    const service = new AiService(
      createConfigService({
        GEMINI_API_KEY: 'test-key',
        GEMINI_MODEL: 'gemini-2.5-flash-lite',
      }),
    );

    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve({
          candidates: [
            {
              content: {
                parts: [{ text: 'Texto mejorado' }],
              },
            },
          ],
        }),
    }) as typeof fetch;

    await expect(
      service.improveText({ text: 'Texto original' }),
    ).resolves.toEqual({
      originalText: 'Texto original',
      improvedText: 'Texto mejorado',
      provider: 'gemini',
      model: 'gemini-2.5-flash-lite',
    });
  });

  it('improves text with Nestle GenIA when AI_PROVIDER=nestle', async () => {
    const service = new AiService(
      createConfigService({
        AI_PROVIDER: 'nestle',
        CLIENT_ID: 'client-id',
        CLIENT_SECRET: 'client-secret',
        NESTLE_GENIA_URL:
          'https://eur-sdr-int-pub.nestle.com/api/dv-exp-sandbox-openai-api/1/genai/GCP/gemini-2.5-pro/generateContent',
      }),
    );

    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve({
          candidates: [
            {
              content: {
                parts: [{ text: 'Texto mejorado por Nestle' }],
              },
            },
          ],
        }),
    }) as typeof fetch;

    await expect(
      service.improveText({ text: 'Texto original' }),
    ).resolves.toEqual({
      originalText: 'Texto original',
      improvedText: 'Texto mejorado por Nestle',
      provider: 'nestle',
      model: 'gemini-2.5-pro',
    });
  });
});
