import { IsNotEmpty, IsString } from 'class-validator';

export class TextInputDto {
  @IsString()
  @IsNotEmpty()
  text: string;
}
