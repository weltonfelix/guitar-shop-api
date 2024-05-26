import { ApiProperty } from '@nestjs/swagger';
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
  @ApiProperty({
    example: 'john@doe.com',
    description: 'The email of the user',
    type: 'email',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'MyP@ssw0rd',
    description: 'The password of the user',
    type: 'string',
  })
  @IsStrongPassword()
  password: string;

  @ApiProperty({
    example: 'MyP@ssw0rd',
    description: 'The password confirmation of the user',
    type: 'string',
  })
  @IsStrongPassword()
  passwordConfirmation: string;

  @ApiProperty({
    example: 'John Doe',
    description: 'The name of the user',
    type: 'string',
  })
  @IsString()
  name: string;

  @ApiProperty({
    example: '12345678909',
    description: 'The CPF of the user (only numbers)',
    type: 'string',
    minLength: 11,
    maxLength: 11,
  })
  @IsNumberString({
    no_symbols: true,
  })
  @Length(11, 11)
  cpf: string;

  @ApiProperty({
    example: '81999999999',
    description: 'The phone number of the user',
    type: 'string',
  })
  @IsString()
  @IsPhoneNumber('BR')
  phone: string;

  @ApiProperty({
    example: 'Rua das Flores',
    description: 'The address of the user',
    type: 'string',
  })
  @IsString()
  address: string;

  @ApiProperty({
    example: '123',
    description: 'The address number of the user',
    type: 'string',
    required: false,
  })
  @IsOptional()
  @IsNumberString({
    no_symbols: true,
  })
  number?: string;

  @ApiProperty({
    example: 'Apto 123',
    description: 'The address complement of the user',
    type: 'string',
    required: false,
  })
  @IsOptional()
  @IsString()
  complement?: string;

  @ApiProperty({
    examples: ['50000-000', '50000000'],
    description: 'The ZIP code of the user',
    type: 'string',
    minLength: 8,
    maxLength: 9,
  })
  @IsString()
  @Length(8, 9)
  zipCode: string;

  @ApiProperty({
    example: 'Iputinga',
    description: 'The neighborhood of the user',
    type: 'string',
  })
  @IsString()
  neighborhood: string;

  @ApiProperty({
    example: 'Recife',
    description: 'The city of the user',
    type: 'string',
  })
  @IsString()
  city: string;

  @ApiProperty({
    example: 'PE',
    description: 'The state of the user',
    type: 'string',
  })
  @IsString()
  state: string;
}

export class CreateUserResponseDto {
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'The ID of the user',
    type: 'uuid',
  })
  id: string;

  @ApiProperty({
    example: 'john@doe.com',
    description: 'The email of the user',
    type: 'email',
  })
  email: string;

  @ApiProperty({
    example: 'John Doe',
    description: 'The name of the user',
    type: 'string',
  })
  name: string;

  @ApiProperty({
    example: '12345678909',
    description: 'The CPF of the user (only numbers)',
    type: 'string',
    minLength: 11,
    maxLength: 11,
  })
  cpf: string;

  @ApiProperty({
    example: '81999999999',
    description: 'The phone number of the user',
    type: 'string',
  })
  phone: string;

  @ApiProperty({
    example: 'Rua das Flores',
    description: 'The address of the user',
    type: 'string',
  })
  address: string;

  @ApiProperty({
    example: '123',
    description: 'The address number of the user',
    type: 'string',
    required: false,
  })
  number?: string;

  @ApiProperty({
    example: 'Apto 123',
    description: 'The address complement of the user',
    type: 'string',
    required: false,
  })
  complement?: string;

  @ApiProperty({
    examples: ['50000-000', '50000000'],
    description: 'The ZIP code of the user',
    type: 'string',
    minLength: 8,
    maxLength: 9,
  })
  zipCode: string;

  @ApiProperty({
    example: 'Iputinga',
    description: 'The neighborhood of the user',
    type: 'string',
  })
  neighborhood: string;

  @ApiProperty({
    example: 'Recife',
    description: 'The city of the user',
    type: 'string',
  })
  city: string;

  @ApiProperty({
    example: 'PE',
    description: 'The state of the user',
    type: 'string',
  })
  state: string;
}
