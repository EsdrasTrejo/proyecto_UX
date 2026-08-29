import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';

import { Request } from 'express';

import { AuthGuard } from '../auth/auth.guard';

import { HabitsService } from './habits.service';

import { CreateHabitDto } from './dto/create-habit.dto';
import { UpdateHabitDto } from './dto/update-habit.dto';

interface AuthenticatedRequest extends Request {
  user: {
    sub: string;
    email: string;
  };
}

@Controller('habits')
@UseGuards(AuthGuard)
export class HabitsController {
  constructor(private readonly habitsService: HabitsService) {}

  @Post()
  create(
    @Req() request: AuthenticatedRequest,
    @Body() createHabitDto: CreateHabitDto,
  ) {
    return this.habitsService.create(request.user.sub, createHabitDto);
  }

  @Get()
  findAll(@Req() request: AuthenticatedRequest) {
    return this.habitsService.findAll(request.user.sub);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() request: AuthenticatedRequest) {
    return this.habitsService.findOne(id, request.user.sub);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Req() request: AuthenticatedRequest,
    @Body() updateHabitDto: UpdateHabitDto,
  ) {
    return this.habitsService.update(id, request.user.sub, updateHabitDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() request: AuthenticatedRequest) {
    return this.habitsService.remove(id, request.user.sub);
  }
}
