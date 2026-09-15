import { Controller, Get, Req, UseGuards } from '@nestjs/common';

import { Request } from 'express';

import { AuthGuard } from '../auth/auth.guard';

import { StatisticsService } from './statistics.service';

interface AuthenticatedRequest extends Request {
  user: {
    sub: string;
    email: string;
  };
}

@Controller('statistics')
@UseGuards(AuthGuard)
export class StatisticsController {
  constructor(private readonly statisticsService: StatisticsService) {}

  @Get('summary')
  getSummary(
    @Req()
    request: AuthenticatedRequest,
  ) {
    return this.statisticsService.getSummary(request.user.sub);
  }

  @Get('weekly')
  getWeeklyProgress(
    @Req()
    request: AuthenticatedRequest,
  ) {
    return this.statisticsService.getWeeklyProgress(request.user.sub);
  }

  @Get('monthly')
  getMonthlyProgress(
    @Req()
    request: AuthenticatedRequest,
  ) {
    return this.statisticsService.getMonthlyProgress(request.user.sub);
  }

  @Get('streaks')
  getStreaks(
    @Req()
    request: AuthenticatedRequest,
  ) {
    return this.statisticsService.getStreaks(request.user.sub);
  }
}
