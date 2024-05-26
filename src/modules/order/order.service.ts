import { Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from '../../database/prisma.service';

import { CreateOrderDto } from './dto/create-order.dto';

interface RequestUser {
  sub: string;
  roles: string[];
}

@Injectable()
export class OrderService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, createOrderDto: CreateOrderDto) {
    let total = 0;
    const productsOnOrder = [];
    for (const product of createOrderDto.products) {
      const productExists = await this.prisma.product.findUnique({
        where: { id: product.id },
      });

      if (!productExists) {
        throw new NotFoundException('Product not found');
      }

      total += productExists.price * product.quantity;
      productsOnOrder.push({
        productId: product.id,
        quantity: product.quantity,
        price: productExists.price,
      });
    }

    return await this.prisma.order.create({
      data: {
        userId,
        products: {
          createMany: { data: productsOnOrder },
        },
        status: 'ACTIVE',
        total,
      },
    });
  }

  async findAll() {
    return this.prisma.order.findMany();
  }

  async findAllByUser(userId: string) {
    return this.prisma.order.findMany({
      where: {
        userId,
      },
    });
  }

  async findOne(id: string, user: RequestUser) {
    const orderExists = await this.prisma.order.findUnique({
      where: { id },
      include: {
        products: {
          include: { product: true },
        },
      },
    });

    const isUserAllowed =
      user.roles.includes('ADMIN') || orderExists?.userId === user.sub;

    if (!orderExists || !isUserAllowed) {
      throw new NotFoundException();
    }

    return orderExists;
  }

  async remove(id: string, user: RequestUser) {
    const orderExists = await this.prisma.order.findUnique({ where: { id } });

    const isUserAllowed =
      user.roles.includes('ADMIN') || orderExists?.userId === user.sub;

    if (!orderExists || !isUserAllowed) {
      throw new NotFoundException();
    }

    await this.prisma.order.update({
      where: { id },
      data: { status: 'CANCELLED' },
    });
  }
}
