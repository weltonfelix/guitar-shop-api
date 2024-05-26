import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  Param,
  Post,
  Put,
} from '@nestjs/common';

import { ProductService } from './product.service';

import { CreateProductDTO } from './dto/create-product.dto';
import { UpdateProductDTO } from './dto/update-product.dto';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  async create(@Body() data: CreateProductDTO) {
    return await this.productService.create(data);
  }

  @Get()
  async findAll() {
    return await this.productService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      return await this.productService.findOne(Number(id));
    } catch (error) {
      if (error.message === 'Product not found') {
        throw new HttpException('Product not found', 404);
      }
    }
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() data: UpdateProductDTO) {
    try {
      return await this.productService.update(Number(id), data);
    } catch (error) {
      if (error.message === 'Product not found') {
        throw new HttpException('Product not found', 404);
      }
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      return await this.productService.remove(Number(id));
    } catch (error) {
      if (error.message === 'Product not found') {
        throw new HttpException('Product not found', 404);
      }
    }
  }
}
