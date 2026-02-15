import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';
import jwksRsa from 'jwks-rsa';
import { UsersService } from '../users/users.service';
import { IdentityProvider } from '../common/enums/identity-provider.enum';

interface SupabaseJwtPayload {
  sub: string;
  email?: string;
  user_metadata?: {
    full_name?: string;
    name?: string;
    avatar_url?: string;
  };
  app_metadata?: {
    provider?: string;
  };
  aud: string;
  exp: number;
}

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private readonly jwtSecret: string;
  private readonly jwksClient: jwksRsa.JwksClient;

  constructor(
    private configService: ConfigService,
    private usersService: UsersService,
  ) {
    this.jwtSecret = this.configService.get<string>('SUPABASE_JWT_SECRET');

    const supabaseUrl = this.configService.get<string>('SUPABASE_URL');
    this.jwksClient = jwksRsa({
      jwksUri: `${supabaseUrl}/auth/v1/.well-known/jwks.json`,
      cache: true,
      cacheMaxAge: 600000,
    });
  }

  async verifyToken(token: string): Promise<SupabaseJwtPayload> {
    try {
      const header = JSON.parse(
        Buffer.from(token.split('.')[0], 'base64').toString(),
      );

      if (header.alg === 'HS256') {
        return jwt.verify(token, this.jwtSecret) as SupabaseJwtPayload;
      }

      const key = await this.jwksClient.getSigningKey(header.kid);
      const publicKey = key.getPublicKey();
      return jwt.verify(token, publicKey, {
        algorithms: ['ES256'],
      }) as SupabaseJwtPayload;
    } catch (err) {
      this.logger.warn(`JWT verification failed: ${err.message}`);
      throw new UnauthorizedException('Invalid or expired token');
    }
  }

  async resolveUserFromToken(token: string) {
    const payload = await this.verifyToken(token);

    const supabaseProvider = payload.app_metadata?.provider;
    const provider =
      supabaseProvider === 'google'
        ? IdentityProvider.GOOGLE
        : IdentityProvider.EMAIL;

    const name =
      payload.user_metadata?.full_name ?? payload.user_metadata?.name;

    const user = await this.usersService.resolveByProvider({
      provider,
      provider_user_id: payload.sub,
      email: payload.email,
      name,
      avatar_url: payload.user_metadata?.avatar_url,
    });

    this.logger.log(`Resolved JWT user ${user.id} (sub: ${payload.sub})`);
    return user;
  }
}
