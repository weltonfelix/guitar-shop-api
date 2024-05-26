import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  InternalServerErrorException,
  Post,
} from '@nestjs/common';
import {
  ApiExtraModels,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { CreateUserDto } from '../users/dto/create-user.dto';
import { UsersService } from '../users/users.service';

import { AuthService } from './auth.service';
import { SigninDto, SigninResponseDto } from './dto/signin.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UsersService,
  ) {}

  @ApiOperation({
    summary: 'Creates a new user',
  })
  @ApiResponse({
    status: 201,
    description: 'User created',
  })
  @ApiResponse({
    status: 400,
    description: 'User already exists',
  })
  @Post('signup')
  async signup(@Body() data: CreateUserDto) {
    try {
      return await this.userService.create(data);
    } catch (error) {
      if (error.code === 'P2002') {
        throw new BadRequestException('User already exists');
      } else {
        throw error;
      }
    }
  }

  @ApiOperation({
    summary: 'Creates a new JWT token',
  })
  @ApiExtraModels(SigninResponseDto)
  @ApiOkResponse({
    description: 'User authenticated',
    schema: {
      $ref: '#/components/schemas/SigninResponseDto',
    },
  })
  @ApiUnauthorizedResponse()
  @HttpCode(HttpStatus.OK)
  @Post('signin')
  async signin(@Body() data: SigninDto) {
    return await this.authService.signIn(data.email, data.password);
  }
}
