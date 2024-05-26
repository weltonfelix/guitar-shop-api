import {
  IsEmail,
  IsNumberString,
  IsOptional,
  IsPhoneNumber,
  IsString,
  IsStrongPassword,
  Length,
} from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email: string;
  @IsStrongPassword()
  password: string;
  @IsStrongPassword()
  passwordConfirmation: string;
  @IsString()
  name: string;
  @IsNumberString({
    no_symbols: true,
  })
  @Length(11, 11)
  cpf: string;
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
}
