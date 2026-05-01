import {
  Body,
  Controller,
  Headers,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { AiService } from './ai.service';
import type {
  ImproveTextRequestDto,
  ImproveTextResponseDto,
} from './dto/improve-text.dto';
import { Resource } from '../modules/auth/enum/resources';

@Controller(Resource.AI)
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('improve-text')
  improveText(
    @Headers('authorization') authorization: string | undefined,
    @Body() body: ImproveTextRequestDto,
  ): Promise<ImproveTextResponseDto> {
    if (!authorization?.startsWith('Bearer ')) {
      throw new UnauthorizedException('Authentication is required');
    }

    return this.aiService.improveText(body);
  }
}
