import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';
import { IdentityProvider } from '../../common/enums/identity-provider.enum';

export class ResolveUserDto {
  @IsEnum(IdentityProvider)
  provider: IdentityProvider;

  @IsString()
  @IsNotEmpty()
  provider_user_id: string;

  @IsString()
  @IsOptional()
  name?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsUrl()
  @IsOptional()
  avatar_url?: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsObject()
  @IsOptional()
  metadata?: Record<string, unknown>;
}
