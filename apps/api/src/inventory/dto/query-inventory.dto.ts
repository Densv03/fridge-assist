import { IsEnum, IsOptional } from 'class-validator';
import { InventoryStatus } from '../../common/enums/inventory-status.enum';

export class QueryInventoryDto {
  @IsEnum(InventoryStatus)
  @IsOptional()
  status?: InventoryStatus;
}
