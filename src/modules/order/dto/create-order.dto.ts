import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsNumber, Min, ValidateNested } from 'class-validator';

export class CreateOrderDto {
  @ApiProperty({
    example: [
      { id: 1, quantity: 2 },
      { id: 2, quantity: 1 },
    ],
    description: 'The products to be ordered',
    type: 'array',
    items: {
      type: 'object',
      properties: {
        id: {
          type: 'number',
          example: 1,
        },
        quantity: {
          type: 'number',
          example: 2,
        },
      },
    },
  })
  @IsArray()
  @ValidateNested()
  @Type(() => ProductInOrderDTO)
  products: ProductInOrderDTO[];
}

class ProductInOrderDTO {
  @IsNumber()
  id: number;
  @IsNumber()
  @Min(1)
  quantity: number;
}

export class CreateOrderResponseDTO {
  @ApiProperty({
    example: 'd290f1ee-6c54-4b01-90e6-d701748f0851',
    description: 'The ID of the order',
    type: 'uuid',
  })
  id: string;

  @ApiProperty({
    example: 'ACTIVE',
    description: 'The status of the order',
    enum: ['CANCELED', 'ACTIVE'],
  })
  status: string;

  @ApiProperty({
    example: 1000.99,
    description: 'The total prie of the order',
  })
  total: number;

  @ApiProperty({
    example: 'd290f1ee-6c54-4b01-90e6-d701748f0851',
    description: 'The ID of the user who created the order',
    type: 'uuid',
  })
  userId: string;

  @ApiProperty({
    example: '2021-07-29T14:58:00.000Z',
    description: 'The date the order was created',
    type: 'date-time',
  })
  createdAt: Date;

  @ApiProperty({
    example: '2021-07-29T14:58:00.000Z',
    description: 'The date the order was last updated',
    type: 'date-time',
  })
  updatedAt: Date;
}
