import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';

import { AuthGuard } from '../auth/auth.guard';
import { ProductService } from './product.service';

import { CreateProductDTO } from './dto/create-product.dto';
import { UpdateProductDTO } from './dto/update-product.dto';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @UseGuards(AuthGuard)
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

  @UseGuards(AuthGuard)
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

  @UseGuards(AuthGuard)
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
