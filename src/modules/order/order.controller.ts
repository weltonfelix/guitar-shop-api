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

import { AuthGuard, AuthRequest } from '../auth/auth.guard';
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
    try {
      return await this.orderService.create(request.user.sub, createOrderDto);
    } catch (error) {
      console.log(error)
      if (error.message === 'Product not found') {
        throw new BadRequestException('Product not found');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  @Get()
  async findAll() {
    return await this.orderService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      return await this.orderService.findOne(id);
    } catch (error) {
      if (error.message === 'Order not found') {
        throw new HttpException('Order not found', 404);
      }
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      return await this.orderService.remove(id);
    } catch (error) {
      if (error.message === 'Order not found') {
        throw new HttpException('Order not found', 404);
      }
    }
  }
}
