import { Injectable } from '@nestjs/common';

import { PrismaService } from 'src/database/prisma.service';

import { CreateOrderDto } from './dto/create-order.dto';

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
        throw new Error('Product not found');
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

  async findOne(id: string) {
    const orderExists = await this.prisma.order.findUnique({
      where: { id },
      include: {
        products: {
          include: { product: true },
        },
      },
    });

    if (!orderExists) {
      throw new Error('Order not found');
    }

    return orderExists;
  }

  async remove(id: string) {
    const orderExists = await this.prisma.order.findUnique({ where: { id } });

    if (!orderExists) {
      throw new Error('Order not found');
    }

    await this.prisma.order.update({
      where: { id },
      data: { status: 'CANCELLED' },
    });
  }
}
