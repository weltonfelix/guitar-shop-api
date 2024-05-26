import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

import { PrismaService } from '../../database/prisma.service';
import { UsersService } from '../users/users.service';
import { BadRequestException } from '@nestjs/common';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;
  let usersService: UsersService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: PrismaService,
          useValue: {},
        },
        {
          provide: JwtService,
          useValue: {},
        },
        AuthService,
        UsersService,
      ],
    }).compile();

    authService = moduleRef.get<AuthService>(AuthService);
    usersService = moduleRef.get<UsersService>(UsersService);
    authController = moduleRef.get<AuthController>(AuthController);
  });

  describe('signup', () => {
    it('should create a user', async () => {
      const data = {
        email: 'john@doe.com',
        name: 'John Doe',
        cpf: '12345678909',
        phone: '81999999999',
        address: 'Rua das Flores',
        number: '123',
        complement: 'Apto 123',
        zipCode: 'stringst',
        neighborhood: 'Iputinga',
        city: 'Recife',
        state: 'PE',
      };

      const result = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        isAdmin: false,
        ...data,
      };

      jest.spyOn(usersService, 'create').mockImplementation(async () => result);

      expect(
        await authController.signup({
          ...data,
          password: 'MyP@ssw0rd',
          passwordConfirmation: 'MyP@ssw0rd',
        }),
      ).toBe(result);
    });

    it('should throw an error if user already exists', async () => {
      const data = {
        email: 'john@doe.com',
        name: 'John Doe',
        cpf: '12345678909',
        phone: '81999999999',
        address: 'Rua das Flores',
        number: '123',
        complement: 'Apto 123',
        zipCode: 'stringst',
        neighborhood: 'Iputinga',
        city: 'Recife',
        state: 'PE',
      };

      jest.spyOn(usersService, 'create').mockImplementation(async () => {
        throw { code: 'P2002' };
      });

      await expect(
        authController.signup({
          ...data,
          password: 'MyP@ssw0rd',
          passwordConfirmation: 'MyP@ssw0rd',
        }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('signin', () => {
    it('should return a token', async () => {
      const data = {
        email: 'john@doe.com',
        password: 'MyP@ssw0rd',
      };

      const result = {
        access_token: 'token',
      };

      jest.spyOn(authService, 'signIn').mockResolvedValue(result);

      expect(await authController.signin(data)).toBe(result);
      expect(authService.signIn).toHaveBeenCalledWith(
        data.email,
        data.password,
      );
      expect(authService.signIn).toHaveBeenCalledTimes(1);
    });
  });
});
