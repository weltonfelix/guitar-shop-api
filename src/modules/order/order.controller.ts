import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiExtraModels,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { AuthGuard, AuthRequest } from '../auth/guards/auth.guard';
import { OrderService } from './order.service';

import { CreateOrderDto, CreateOrderResponseDTO } from './dto/create-order.dto';

@ApiBearerAuth()
@ApiUnauthorizedResponse()
@ApiTags('Order')
@UseGuards(AuthGuard)
@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @ApiOperation({
    summary: 'Order checkout',
  })
  @ApiExtraModels(CreateOrderResponseDTO)
  @ApiCreatedResponse({
    description: 'Order created',
    schema: {
      $ref: '#/components/schemas/CreateOrderResponseDTO',
    },
  })
  @ApiNotFoundResponse({
    description: 'A product was not found',
  })
  @Post()
  async create(
    @Body() createOrderDto: CreateOrderDto,
    @Req() request: AuthRequest,
  ) {
    return await this.orderService.create(request.user.sub, createOrderDto);
  }

  @ApiOperation({
    summary: 'Find all orders from all users',
  })
  @ApiExtraModels(CreateOrderResponseDTO)
  @ApiOkResponse({
    description: 'List of orders',
    schema: {
      type: 'array',
      items: {
        $ref: '#/components/schemas/CreateOrderResponseDTO',
      },
    },
  })
  @Roles(['ADMIN'])
  @UseGuards(RolesGuard)
  @Get('all')
  async findAll() {
    return await this.orderService.findAll();
  }

  @ApiOperation({
    summary: 'Find all orders from the authenticated user',
  })
  @ApiExtraModels(CreateOrderResponseDTO)
  @ApiOkResponse({
    description: 'List of orders',
    schema: {
      type: 'array',
      items: {
        $ref: '#/components/schemas/CreateOrderResponseDTO',
      },
    },
  })
  @Get()
  async findAllByUser(@Req() request: AuthRequest) {
    return await this.orderService.findAllByUser(request.user.sub);
  }

  @ApiOperation({
    summary: 'Find a specific order',
    description:
      'Users can find their own orders, but admins can find any order.',
  })
  @ApiNotFoundResponse({
    description: 'Order not found',
  })
  @ApiExtraModels(CreateOrderResponseDTO)
  @ApiOkResponse({
    description: 'Order found',
    schema: {
      $ref: '#/components/schemas/CreateOrderResponseDTO',
    },
  })
  @Get(':id')
  async findOne(@Param('id') id: string, @Req() request: AuthRequest) {
    return await this.orderService.findOne(id, request.user);
  }

  @ApiOperation({
    summary: 'Cancels an order',
    description:
      'Users can cancel their own orders, but admins can cancel any order',
  })
  @ApiNotFoundResponse({
    description: 'Order not found',
  })
  @ApiOkResponse({
    description: 'Order canceled successfully',
  })
  @Delete(':id')
  async remove(@Param('id') id: string, @Req() request: AuthRequest) {
    return await this.orderService.remove(id, request.user);
  }
}
