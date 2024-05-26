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
  @IsString()
  name: string;
  @IsNumberString({
    no_symbols: true,
  })
  @Length(11, 11)
  cpf: string;
  @IsEmail()
  email: string;
  @IsString()
  @IsPhoneNumber('BR')
  phone: string;
  @IsString()
  address: string;
  @IsOptional()
  @IsNumberString({
    no_symbols: true,
  })
  number?: string;
  @IsOptional()
  @IsString()
  complement?: string;
  @IsString()
  @Length(8, 9)
  zipCode: string;
  @IsString()
  neighborhood: string;
  @IsString()
  city: string;
  @IsString()
  state: string;
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
