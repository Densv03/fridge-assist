import { Controller, Get, UseGuards } from '@nestjs/common';
import { UserExistsGuard } from '../common/guards/user-exists.guard';
import { UserId } from '../common/pipes/parse-user-id.pipe';
import { UsersService } from '../users/users.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @UseGuards(UserExistsGuard)
  getMe(@UserId() userId: string) {
    return this.usersService.findOne(userId);
  }
}
