import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class SigninDto {
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
  @IsString()
  password: string;
}

export class SigninResponseDto {
  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
    description: 'The JWT token',
    type: 'jwt'
  })
  access_token: string;
}
