import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  HttpException,
  UseGuards,
  Req,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';

import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { AuthGuard, AuthRequest } from '../auth/guards/auth.guard';
import { OrderService } from './order.service';

import { CreateOrderDto } from './dto/create-order.dto';
@UseGuards(AuthGuard)
@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  async create(
    @Body() createOrderDto: CreateOrderDto,
    @Req() request: AuthRequest,
  ) {
    return await this.orderService.create(request.user.sub, createOrderDto);
  }

  @Roles(['ADMIN'])
  @UseGuards(RolesGuard)
  @Get('all')
  async findAll() {
    return await this.orderService.findAll();
  }

  @Get()
  async findAllByUser(@Req() request: AuthRequest) {
    return await this.orderService.findAllByUser(request.user.sub);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Req() request: AuthRequest) {
    return await this.orderService.findOne(id, request.user);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Req() request: AuthRequest) {
    return await this.orderService.remove(id, request.user);
  }
}
