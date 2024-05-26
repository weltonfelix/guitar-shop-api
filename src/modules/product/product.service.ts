import { Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from '../../database/prisma.service';

import { CreateProductDTO } from './dto/create-product.dto';
import { UpdateProductDTO } from './dto/update-product.dto';

@Injectable()
export class ProductService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateProductDTO) {
    const product = await this.prisma.product.create({ data });
    return product;
  }

  async findAll() {
    const products = await this.prisma.product.findMany();
    return products;
  }

  async searchByName(query: string) {
    const products = await this.prisma.product.findMany({
      where: {
        title: {
          contains: query,
        },
      },
    });

    return products;
  }

  async findOne(id: number) {
    const product = await this.prisma.product.findUnique({ where: { id } });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return product;
  }

  async update(id: number, data: UpdateProductDTO) {
    const productExists = await this.prisma.product.findUnique({
      where: { id },
    });

    if (!productExists) {
      throw new NotFoundException('Product not found');
    }

    const product = await this.prisma.product.update({ where: { id }, data });
    return product;
  }

  async remove(id: number) {
    const productExists = await this.prisma.product.findUnique({
      where: { id },
    });

    if (!productExists) {
      throw new NotFoundException('Product not found');
    }

    await this.prisma.product.delete({ where: { id } });
    return true;
  }
}
