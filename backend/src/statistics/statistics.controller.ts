import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { AuthGuard } from '../auth/auth.guard';
import { StatisticsService } from './statistics.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  MonthlyProgressResponseDto,
  StreaksResponseDto,
  SummaryResponseDto,
  TrendResponseDto,
  WeeklyProgressResponseDto,
} from './dto/statistics-response.dto';

interface AuthenticatedRequest extends Request {
  user: {
    sub: string;
    email: string;
  };
}

@Controller('statistics')
@UseGuards(AuthGuard)
@ApiTags('Statistics')
@ApiBearerAuth()
export class StatisticsController {
  constructor(private readonly statisticsService: StatisticsService) {}

  @Get('summary')
  @ApiOperation({
    summary: 'Obtener resumen general de hábitos',
  })
  @ApiResponse({
    status: 200,
    type: SummaryResponseDto,
  })
  getSummary(
    @Req()
    request: AuthenticatedRequest,
  ) {
    return this.statisticsService.getSummary(request.user.sub);
  }

  @Get('weekly')
  @ApiOperation({
    summary: 'Obtener progreso semanal',
  })
  @ApiResponse({
    status: 200,
    type: WeeklyProgressResponseDto,
  })
  getWeeklyProgress(
    @Req()
    request: AuthenticatedRequest,
  ) {
    return this.statisticsService.getWeeklyProgress(request.user.sub);
  }

  @Get('monthly')
  @ApiOperation({
    summary: 'Obtener progreso mensual',
  })
  @ApiResponse({
    status: 200,
    type: MonthlyProgressResponseDto,
  })
  getMonthlyProgress(
    @Req()
    request: AuthenticatedRequest,
  ) {
    return this.statisticsService.getMonthlyProgress(request.user.sub);
  }

  @Get('streaks')
  @ApiOperation({
    summary: 'Obtener rachas de hábitos',
  })
  @ApiResponse({
    status: 200,
    type: StreaksResponseDto,
  })
  getStreaks(
    @Req()
    request: AuthenticatedRequest,
  ) {
    return this.statisticsService.getStreaks(request.user.sub);
  }
  @Get('trend')
  @ApiOperation({
    summary: 'Obtener tendencia de cumplimiento de los últimos 30 días',
  })
  @ApiResponse({
    status: 200,
    type: TrendResponseDto,
  })
  getTrend(
    @Req()
    request: AuthenticatedRequest,
  ) {
    return this.statisticsService.getTrend(request.user.sub);
  }
}
