import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class SearchProductsDTO {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'Guit',
    description: 'The query to search for products',
  })
  query: string;
}
