import {
  Controller,
  Post,
  Body,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
  UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Multer } from 'multer';
import { IngestionService } from './ingestion.service';
import { TextInputDto } from './dto/text-input.dto';
import { UserId } from '../common/pipes/parse-user-id.pipe';
import { UserExistsGuard } from '../common/guards/user-exists.guard';

const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/heic',
  'image/heif',
];

const ALLOWED_AUDIO_TYPES = [
  'audio/wav',
  'audio/mp3',
  'audio/mpeg',
  'audio/ogg',
  'audio/webm',
  'audio/flac',
];

@Controller('ingestion')
@UseGuards(UserExistsGuard)
export class IngestionController {
  constructor(private readonly ingestionService: IngestionService) {}

  @Post('text')
  processText(@UserId() userId: string, @Body() dto: TextInputDto) {
    return this.ingestionService.processText(userId, dto.text, 'text');
  }

  @Post('image')
  @UseInterceptors(FileInterceptor('file'))
  processImage(
    @UserId() userId: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('File is required');
    }
    if (!ALLOWED_IMAGE_TYPES.includes(file.mimetype)) {
      throw new BadRequestException(
        `Unsupported image type: ${file.mimetype}. Allowed: ${ALLOWED_IMAGE_TYPES.join(', ')}`,
      );
    }
    return this.ingestionService.processImage(
      userId,
      file.buffer,
      file.mimetype,
      file.originalname,
    );
  }

  @Post('audio')
  @UseInterceptors(FileInterceptor('file'))
  processAudio(
    @UserId() userId: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('File is required');
    }
    if (!ALLOWED_AUDIO_TYPES.includes(file.mimetype)) {
      throw new BadRequestException(
        `Unsupported audio type: ${file.mimetype}. Allowed: ${ALLOWED_AUDIO_TYPES.join(', ')}`,
      );
    }
    return this.ingestionService.processAudio(
      userId,
      file.buffer,
      file.mimetype,
      file.originalname,
    );
  }
}
