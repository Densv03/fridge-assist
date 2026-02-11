import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../../users/users.service';

@Injectable()
export class UserExistsGuard implements CanActivate {
  constructor(private usersService: UsersService) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const request = ctx.switchToHttp().getRequest();
    const userId = request.headers['x-user-id'];

    if (!userId) {
      throw new UnauthorizedException('x-user-id header is required');
    }

    const exists = await this.usersService.exists(userId);
    if (!exists) {
      throw new UnauthorizedException(`User ${userId} not found`);
    }

    return true;
  }
}
