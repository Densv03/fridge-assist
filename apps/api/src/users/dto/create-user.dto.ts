import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';
import { IdentityProvider } from '../../common/enums/identity-provider.enum';

export class CreateUserDto {
  @IsEnum(IdentityProvider)
  provider: IdentityProvider;

  @IsString()
  @IsNotEmpty()
  provider_user_id: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsObject()
  @IsOptional()
  metadata?: Record<string, unknown>;
}
