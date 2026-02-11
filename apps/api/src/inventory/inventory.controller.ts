import {
  Controller,
  Get,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
} from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { QueryInventoryDto } from './dto/query-inventory.dto';
import { UserId } from '../common/pipes/parse-user-id.pipe';
import { UserExistsGuard } from '../common/guards/user-exists.guard';

@Controller('inventory')
@UseGuards(UserExistsGuard)
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Get()
  findAll(@UserId() userId: string, @Query() query: QueryInventoryDto) {
    return this.inventoryService.findAllForUser(userId, query.status);
  }

  @Get(':id')
  findOne(@UserId() userId: string, @Param('id') id: string) {
    return this.inventoryService.findOne(id, userId);
  }

  @Patch(':id')
  update(
    @UserId() userId: string,
    @Param('id') id: string,
    @Body() body: { quantity?: number; unit?: string; expires_at?: string },
  ) {
    return this.inventoryService.update(id, userId, body);
  }

  @Delete(':id')
  remove(@UserId() userId: string, @Param('id') id: string) {
    return this.inventoryService.remove(id, userId);
  }
}
