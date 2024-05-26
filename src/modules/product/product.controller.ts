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

import { AuthGuard } from '../auth/guards/auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { ProductService } from './product.service';

import { CreateProductDTO } from './dto/create-product.dto';
import { UpdateProductDTO } from './dto/update-product.dto';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Roles(['ADMIN'])
  @UseGuards(AuthGuard, RolesGuard)
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

  @Roles(['ADMIN'])
  @UseGuards(AuthGuard, RolesGuard)
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

  @Roles(['ADMIN'])
  @UseGuards(AuthGuard, RolesGuard)
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
