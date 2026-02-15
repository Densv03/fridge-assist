import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { CreateReportDto } from './dto/create-report.dto';
import { UserExistsGuard } from '../common/guards/user-exists.guard';
import { UserId } from '../common/pipes/parse-user-id.pipe';

@Controller('reports')
@UseGuards(UserExistsGuard)
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Post()
  create(@UserId() userId: string, @Body() dto: CreateReportDto) {
    return this.reportsService.create(userId, dto.type, dto.description);
  }
}
