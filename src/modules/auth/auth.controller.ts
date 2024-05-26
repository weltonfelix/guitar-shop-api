import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  InternalServerErrorException,
  Post,
} from '@nestjs/common';

import { CreateUserDto } from '../users/dto/create-user.dto';
import { UsersService } from '../users/users.service';

import { AuthService } from './auth.service';
import { SigninDto } from './dto/signin.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UsersService,
  ) {}

  @Post('signup')
  async signup(@Body() data: CreateUserDto) {
    try {
      return await this.userService.create(data);
    } catch (error) {
      if (error.message === 'Password confirmation does not match') {
        throw new BadRequestException('Password confirmation does not match');
      } else if (error.code === 'P2002') {
        throw new BadRequestException('User already exists');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }
  @HttpCode(HttpStatus.OK)
  @Post('signin')
  async signin(@Body() data: SigninDto) {
    return await this.authService.signIn(data.email, data.password);
  }
}
