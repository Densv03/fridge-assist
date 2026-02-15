import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../../users/users.service';
import { AuthService } from '../../auth/auth.service';

@Injectable()
export class UserExistsGuard implements CanActivate {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
  ) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const request = ctx.switchToHttp().getRequest();

    // 1. Try JWT auth (mobile/web clients)
    const authHeader = request.headers['authorization'];
    if (authHeader?.startsWith('Bearer ')) {
      const token = authHeader.slice(7);
      const user = await this.authService.resolveUserFromToken(token);
      request.headers['x-user-id'] = user.id;
      return true;
    }

    // 2. Fall back to x-user-id header (Telegram bot)
    const userId = request.headers['x-user-id'];
    if (!userId) {
      throw new UnauthorizedException('Authorization required');
    }

    const exists = await this.usersService.exists(userId);
    if (!exists) {
      throw new UnauthorizedException(`User ${userId} not found`);
    }

    return true;
  }
}
