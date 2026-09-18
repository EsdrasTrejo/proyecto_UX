import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';

import { Request } from 'express';
import { AuthGuard } from '../auth/auth.guard';
import { HabitsService } from './habits.service';
import { CreateHabitDto } from './dto/create-habit.dto';
import { UpdateHabitDto } from './dto/update-habit.dto';
import { MarkHabitDto } from './dto/mark-habit.dto';
import { MongoIdPipe } from '../common/pipes/mongo-id.pipe';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { HabitResponseDto } from './dto/habit-response.dto';
import { HabitRecordResponseDto } from './dto/habit-record-response.dto';

interface AuthenticatedRequest extends Request {
  user: {
    sub: string;
    email: string;
  };
}

@Controller('habits')
@UseGuards(AuthGuard)
@ApiTags('Habits')
@ApiBearerAuth()
@Controller('habits')
export class HabitsController {
  constructor(private readonly habitsService: HabitsService) {}

  @Post()
  @ApiOperation({
    summary: 'Crear un hábito',
  })
  @ApiResponse({
    status: 201,
    type: HabitResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Datos inválidos',
  })
  @ApiResponse({
    status: 401,
    description: 'No autorizado',
  })
  create(
    @Req() request: AuthenticatedRequest,
    @Body() createHabitDto: CreateHabitDto,
  ) {
    return this.habitsService.create(request.user.sub, createHabitDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Obtener todos los hábitos del usuario',
  })
  @ApiResponse({
    status: 200,
    type: HabitResponseDto,
    isArray: true,
  })
  findAll(@Req() request: AuthenticatedRequest) {
    return this.habitsService.findAll(request.user.sub);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obtener un hábito por ID',
  })
  @ApiParam({
    name: 'id',
    description: 'ObjectId del hábito',
    example: '68c85e94de6b108875d46f12',
  })
  @ApiResponse({
    status: 200,
    type: HabitResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'ID inválido',
  })
  @ApiResponse({
    status: 404,
    description: 'Hábito no encontrado',
  })
  findOne(
    @Param('id', MongoIdPipe)
    id: string,

    @Req()
    request: AuthenticatedRequest,
  ) {
    return this.habitsService.findOne(id, request.user.sub);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Actualizar un hábito',
  })
  @ApiParam({
    name: 'id',
    example: '68c85e94de6b108875d46f12',
  })
  @ApiResponse({
    status: 200,
    type: HabitResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Hábito no encontrado',
  })
  update(
    @Param('id', MongoIdPipe)
    id: string,

    @Req()
    request: AuthenticatedRequest,

    @Body()
    updateHabitDto: UpdateHabitDto,
  ) {
    return this.habitsService.update(id, request.user.sub, updateHabitDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Eliminar un hábito',
  })
  @ApiResponse({
    status: 200,
    description: 'Hábito eliminado correctamente',
  })
  @ApiResponse({
    status: 404,
    description: 'Hábito no encontrado',
  })
  remove(
    @Param('id', MongoIdPipe)
    id: string,

    @Req()
    request: AuthenticatedRequest,
  ) {
    return this.habitsService.remove(id, request.user.sub);
  }

  @Put(':id/records/today')
  @ApiOperation({
    summary: 'Marcar o desmarcar un hábito como completado hoy',
  })
  @ApiParam({
    name: 'id',
  })
  @ApiResponse({
    status: 200,
    type: HabitRecordResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'El hábito no corresponde hoy o está inactivo',
  })
  @ApiResponse({
    status: 404,
    description: 'Hábito no encontrado',
  })
  markToday(
    @Param('id', MongoIdPipe)
    id: string,

    @Req()
    request: AuthenticatedRequest,

    @Body()
    markHabitDto: MarkHabitDto,
  ) {
    return this.habitsService.markToday(id, request.user.sub, markHabitDto);
  }

  @Get(':id/records')
  @ApiOperation({
    summary: 'Obtener historial de cumplimiento de un hábito',
  })
  @ApiResponse({
    status: 200,
    type: HabitRecordResponseDto,
    isArray: true,
  })
  findRecords(
    @Param('id', MongoIdPipe)
    id: string,

    @Req()
    request: AuthenticatedRequest,
  ) {
    return this.habitsService.findRecords(id, request.user.sub);
  }
  @Get('today')
  @ApiOperation({
    summary: 'Obtener los hábitos programados para hoy',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de hábitos correspondientes al día actual',
  })
  findToday(@Req() request: AuthenticatedRequest) {
    return this.habitsService.findToday(request.user.sub);
  }
}
