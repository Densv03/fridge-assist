import { IsIn, IsNotEmpty, IsString } from 'class-validator';

export class CreateReportDto {
  @IsString()
  @IsIn(['bug', 'idea'])
  type: 'bug' | 'idea';

  @IsString()
  @IsNotEmpty()
  description: string;
}
