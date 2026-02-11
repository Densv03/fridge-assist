import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { QueryTransactionsDto } from './dto/query-transactions.dto';
import { UserId } from '../common/pipes/parse-user-id.pipe';
import { UserExistsGuard } from '../common/guards/user-exists.guard';

@Controller('transactions')
@UseGuards(UserExistsGuard)
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Get()
  getHistory(
    @UserId() userId: string,
    @Query() query: QueryTransactionsDto,
  ) {
    return this.transactionsService.getHistory(userId, {
      action: query.action,
      limit: query.limit,
      offset: query.offset,
    });
  }

  @Get(':id')
  findOne(@UserId() userId: string, @Param('id') id: string) {
    return this.transactionsService.findOne(id, userId);
  }
}
