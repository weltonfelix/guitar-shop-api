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
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiExtraModels,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
  getSchemaPath,
} from '@nestjs/swagger';

import { AuthGuard } from '../auth/guards/auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { ProductService } from './product.service';

import { CreateProductDTO, CreateProductResponseDTO } from './dto/create-product.dto';
import { UpdateProductDTO } from './dto/update-product.dto';
import { SearchProductsDTO } from './dto/search-products';

@ApiTags('Product')
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @ApiBearerAuth()
  @ApiUnauthorizedResponse()
  @ApiOperation({
    summary: 'Create a new product',
  })
  @ApiExtraModels(CreateProductResponseDTO)
  @ApiCreatedResponse({
    description: 'Product created',
    schema: {
      $ref: getSchemaPath(CreateProductResponseDTO),
    },
  })
  @Roles(['ADMIN'])
  @UseGuards(AuthGuard, RolesGuard)
  @Post()
  async create(@Body() data: CreateProductDTO) {
    return await this.productService.create(data);
  }

  @ApiOperation({
    summary: 'List all products',
  })
  @ApiExtraModels(CreateProductResponseDTO)
  @ApiOkResponse({
    schema: {
      type: 'array',
      items: {
        $ref: getSchemaPath(CreateProductResponseDTO),
      },
    }
  })
  @Get()
  async findAll() {
    return await this.productService.findAll();
  }

  @ApiOperation({
    summary: 'Search all products by name',
  })
  @ApiOkResponse({
    schema: {
      type: 'array',
      items: {
        $ref: getSchemaPath(CreateProductResponseDTO),
      },
    }
  })
  @Get('search')
  async search(@Body() data: SearchProductsDTO) {
    return await this.productService.searchByName(data.query);
  }

  @ApiOperation({
    summary: 'Find a product',
  })
  @ApiExtraModels(CreateProductResponseDTO)
  @ApiOkResponse({
    schema: {
      $ref: getSchemaPath(CreateProductResponseDTO),
    },
  })
  @ApiNotFoundResponse({
    description: 'Product not found',
  })
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.productService.findOne(Number(id));
  }

  @ApiBearerAuth()
  @ApiUnauthorizedResponse()
  @ApiOperation({
    summary: 'Updates a product',
  })
  @ApiExtraModels(CreateProductResponseDTO)
  @ApiOkResponse({
    description: 'Product updated',
    schema: {
      $ref: getSchemaPath(CreateProductResponseDTO),
    },
  })
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

  @ApiBearerAuth()
  @ApiUnauthorizedResponse()
  @ApiOperation({
    summary: 'Deletes a product',
  })
  @ApiOkResponse({
    description: 'Product deleted',
  })
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
