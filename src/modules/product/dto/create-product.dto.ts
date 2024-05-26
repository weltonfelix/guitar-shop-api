import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, IsUrl } from 'class-validator';

export class CreateProductDTO {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'Guitar',
    description: 'The name of the product',
  })
  title: string;

  @IsNumber()
  @ApiProperty({
    example: 1000.99,
    description: 'The price of the product',
  })
  price: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'A beautiful guitar',
    description: 'The description of the product',
  })
  description: string;

  @IsString()
  @IsNotEmpty()
  @IsUrl()
  @ApiProperty({
    example: 'https://example.com/image.jpg',
    description: 'The image URL of the product',
  })
  imageURL: string;
}
export class CreateProductResponseDTO {
  @ApiProperty({
    example: 43,
    description: 'The ID of the product',
  })
  id: number;

  @ApiProperty({
    example: 'Guitar',
    description: 'The name of the product',
  })
  title: string;

  @ApiProperty({
    example: 1000.99,
    description: 'The price of the product',
  })
  price: number;

  @ApiProperty({
    example: 'A beautiful guitar',
    description: 'The description of the product',
  })
  description: string;

  @ApiProperty({
    example: 'https://example.com/image.jpg',
    description: 'The image URL of the product',
  })
  imageURL: string;
}
