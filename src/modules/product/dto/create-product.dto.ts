import { IsNotEmpty, IsNumber, IsString, IsUrl } from 'class-validator';

export class CreateProductDTO {
  @IsString()
  @IsNotEmpty()
  title: string;
  @IsNumber()
  price: number;
  @IsString()
  @IsNotEmpty()
  description: string;
  @IsString()
  @IsNotEmpty()
  @IsUrl()
  imageURL: string;
}
