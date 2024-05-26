import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import * as bcrypt from 'bcrypt';

import { UsersService } from './users.service';

import { PrismaService } from '../../database/prisma.service';
import { BadRequestException } from '@nestjs/common';

describe('UsersService', () => {
  let usersService: UsersService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        {
          provide: PrismaService,
          useValue: {
            user: {
              create: jest.fn(),
              findMany: jest.fn(),
              findUnique: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
            },
          },
        },
        {
          provide: JwtService,
          useValue: {},
        },
        UsersService,
      ],
    }).compile();

    usersService = moduleRef.get<UsersService>(UsersService);
    prismaService = moduleRef.get<PrismaService>(PrismaService);
  });

  describe('create', () => {
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

      jest.spyOn(bcrypt, 'hash').mockImplementation(() => 'hashedPassword');
      jest.spyOn(prismaService.user, 'create').mockResolvedValue({
        id: '123e4567-e89b-12d3-a456-426614174000',
        isAdmin: false,
        ...data,
        passwordHash: 'hashedPassword',
      });

      expect(
        await usersService.create({
          ...data,
          password: 'MyP@ssw0rd',
          passwordConfirmation: 'MyP@ssw0rd',
        }),
      ).toStrictEqual(result);
      expect(prismaService.user.create).toHaveBeenCalledWith({
        data: { ...data, passwordHash: 'hashedPassword' },
      });
      expect(prismaService.user.create).toHaveBeenCalledTimes(1);
    });

    it('should throw an error if password confirmation does not match', async () => {
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

      await expect(
        usersService.create({
          ...data,
          password: 'MyP@ssw0rd',
          passwordConfirmation: 'MyP@ssw0rd2',
        }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('findOne', () => {
    it('should find a user by email', async () => {
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

      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue({
        id: '123e4567-e89b-12d3-a456-426614174000',
        isAdmin: false,
        passwordHash: 'hashedPassword',
        ...data,
      });

      expect(await usersService.findOne('john@doe.com')).toStrictEqual({
        id: '123e4567-e89b-12d3-a456-426614174000',
        isAdmin: false,
        passwordHash: 'hashedPassword',
        ...data,
      });
      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { email: 'john@doe.com' },
      });
      expect(prismaService.user.findUnique).toHaveBeenCalledTimes(1);
    });
  });
});
