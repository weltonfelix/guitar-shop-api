import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import * as bcrypt from 'bcrypt';

import { AuthService } from './auth.service';

import { PrismaService } from '../../database/prisma.service';
import { UsersService } from '../users/users.service';
import { UnauthorizedException } from '@nestjs/common';

describe('AuthService', () => {
  let authService: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        {
          provide: PrismaService,
          useValue: {},
        },
        {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn(),
          },
        },
        UsersService,
        AuthService,
      ],
    }).compile();

    authService = moduleRef.get<AuthService>(AuthService);
    usersService = moduleRef.get<UsersService>(UsersService);
    jwtService = moduleRef.get<JwtService>(JwtService);

    jest.clearAllMocks();
  });

  describe('signIn', () => {
    it('should return access_token', async () => {
      const email = 'john@doe.com';
      const password = 'MyP@ssw0rd';

      const user = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        isAdmin: false,
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

      jest
        .spyOn(usersService, 'findOne')
        .mockResolvedValue({ ...user, passwordHash: 'hashedPassword' });

      jest.spyOn(bcrypt, 'compare').mockImplementation(() => true);

      jest.spyOn(jwtService, 'signAsync').mockResolvedValue('token');

      expect(await authService.signIn(email, password)).toEqual({
        access_token: 'token',
      });
      expect(usersService.findOne).toHaveBeenCalledWith(email);
      expect(bcrypt.compare).toHaveBeenCalledWith(password, 'hashedPassword');
      expect(jwtService.signAsync).toHaveBeenCalledWith({
        email: user.email,
        sub: user.id,
        roles: [],
      });
    });

    it('should throw an error if user does not exist', async () => {
      const email = 'john@doe.com';
      const password = 'MyP@ssw0rd';

      jest.spyOn(usersService, 'findOne').mockResolvedValue(null);
      jest.spyOn(bcrypt, 'compare').mockImplementation(() => true);
      jest.spyOn(jwtService, 'signAsync').mockResolvedValue('token');

      await expect(authService.signIn(email, password)).rejects.toThrow(
        UnauthorizedException,
      );
      expect(usersService.findOne).toHaveBeenCalledWith(email);
      expect(bcrypt.compare).not.toHaveBeenCalled();
      expect(jwtService.signAsync).not.toHaveBeenCalled();
    });

    it('should throw an error if password does not match', async () => {
      const email = 'john@doe.com';
      const password = 'MyP@ssw0rd';

      const user = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        isAdmin: false,
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

      jest
        .spyOn(usersService, 'findOne')
        .mockResolvedValue({ ...user, passwordHash: 'hashedRealPassword' });

      jest.spyOn(bcrypt, 'compare').mockImplementation(() => false);

      jest.spyOn(jwtService, 'signAsync').mockResolvedValue('token');

      await expect(authService.signIn(email, password)).rejects.toThrow(
        UnauthorizedException,
      );
      expect(usersService.findOne).toHaveBeenCalledWith(email);
      expect(bcrypt.compare).toHaveBeenCalledWith(password, 'hashedRealPassword');
      expect(jwtService.signAsync).not.toHaveBeenCalled();
    });
  });
});
