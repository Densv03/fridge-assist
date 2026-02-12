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
import {
  ConfirmPreviewDto,
  CancelPreviewDto,
  RemovePreviewItemDto,
  ResolveAmbiguousDto,
  AddCustomItemDto,
  ReplacePreviewItemDto,
  ChangeAmountDto,
  ResolveUnitConflictDto,
} from './dto/confirm-items.dto';
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

  // ── Existing endpoints (backward compatible) ──

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

  // ── Preview endpoints ──

  @Post('preview/text')
  previewText(@UserId() userId: string, @Body() dto: TextInputDto) {
    return this.ingestionService.previewText(userId, dto.text, 'text');
  }

  @Post('preview/image')
  @UseInterceptors(FileInterceptor('file'))
  previewImage(
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
    return this.ingestionService.previewImage(
      userId,
      file.buffer,
      file.mimetype,
      file.originalname,
    );
  }

  @Post('preview/audio')
  @UseInterceptors(FileInterceptor('file'))
  previewAudio(
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
    return this.ingestionService.previewAudio(
      userId,
      file.buffer,
      file.mimetype,
      file.originalname,
    );
  }

  // ── Confirm / Cancel / Modify preview endpoints ──

  @Post('confirm')
  confirmPreview(@UserId() userId: string, @Body() dto: ConfirmPreviewDto) {
    return this.ingestionService.confirmPreview(userId, dto.preview_id);
  }

  @Post('cancel')
  cancelPreview(@UserId() userId: string, @Body() dto: CancelPreviewDto) {
    return this.ingestionService.cancelPreview(userId, dto.preview_id);
  }

  @Post('preview/remove-item')
  removePreviewItem(
    @UserId() userId: string,
    @Body() dto: RemovePreviewItemDto,
  ) {
    return this.ingestionService.removePreviewItem(
      userId,
      dto.preview_id,
      dto.item_id,
    );
  }

  @Post('preview/resolve-ambiguous')
  resolveAmbiguous(
    @UserId() userId: string,
    @Body() dto: ResolveAmbiguousDto,
  ) {
    return this.ingestionService.resolveAmbiguous(
      userId,
      dto.preview_id,
      dto.item_id,
      dto.ingredient_id,
    );
  }

  @Post('preview/add-custom-item')
  addCustomItem(@UserId() userId: string, @Body() dto: AddCustomItemDto) {
    return this.ingestionService.addCustomItem(
      userId,
      dto.preview_id,
      dto.item_id,
      dto.name,
      dto.name_ua,
    );
  }

  @Post('preview/replace-item')
  replacePreviewItem(
    @UserId() userId: string,
    @Body() dto: ReplacePreviewItemDto,
  ) {
    return this.ingestionService.replacePreviewItem(
      userId,
      dto.preview_id,
      dto.item_id,
      dto.name,
      dto.name_ua,
    );
  }

  @Post('preview/change-amount')
  changePreviewItemAmount(
    @UserId() userId: string,
    @Body() dto: ChangeAmountDto,
  ) {
    return this.ingestionService.changePreviewItemAmount(
      userId,
      dto.preview_id,
      dto.item_id,
      dto.text,
    );
  }

  @Post('preview/resolve-unit-conflict')
  resolveUnitConflict(
    @UserId() userId: string,
    @Body() dto: ResolveUnitConflictDto,
  ) {
    return this.ingestionService.resolveUnitConflict(
      userId,
      dto.preview_id,
      dto.item_id,
      dto.resolution,
    );
  }
}
