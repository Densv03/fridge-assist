import { IsEnum, IsInt, IsOptional, Min } from 'class-validator';
import { ActionType } from '../../common/enums/action-type.enum';

export class QueryTransactionsDto {
  @IsEnum(ActionType)
  @IsOptional()
  action?: ActionType;

  @IsInt()
  @Min(1)
  @IsOptional()
  limit?: number = 50;

  @IsInt()
  @Min(0)
  @IsOptional()
  offset?: number = 0;
}
