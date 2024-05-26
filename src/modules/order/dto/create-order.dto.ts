import { Type } from 'class-transformer';
import {
  IsArray,
  IsEmail,
  IsNumber,
  IsNumberString,
  IsOptional,
  IsPhoneNumber,
  IsString,
  Length,
  Min,
  ValidateNested,
} from 'class-validator';

export class CreateOrderDto {
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
