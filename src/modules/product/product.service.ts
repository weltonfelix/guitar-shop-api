import { Injectable } from '@nestjs/common';

import { PrismaService } from 'src/database/prisma.service';

import { ProductDTO } from './product.dto';

@Injectable()
export class ProductService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: ProductDTO) {
    const product = await this.prisma.product.create({ data });
    return product;
  }

  async findAll() {
    const products = await this.prisma.product.findMany();
    return products;
  }

  async findOne(id: number) {
    const product = await this.prisma.product.findUnique({ where: { id } });

    if (!product) {
      throw new Error('Product not found');
    }

    return product;
  }

  async update(id: number, data: ProductDTO) {
    const productExists = await this.prisma.product.findUnique({
      where: { id },
    });

    if (!productExists) {
      throw new Error('Product not found');
    }

    const product = await this.prisma.product.update({ where: { id }, data });
    return product;
  }

  async remove(id: number) {
    const productExists = await this.prisma.product.findUnique({
      where: { id },
    });

    if (!productExists) {
      throw new Error('Product not found');
    }

    await this.prisma.product.delete({ where: { id } });
    return true;
  }
}
