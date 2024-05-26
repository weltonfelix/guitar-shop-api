import { BadRequestException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { PrismaService } from '../../database/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateUserDto) {
    if (data.password !== data.passwordConfirmation) {
      throw new BadRequestException('Password confirmation does not match');
    }

    const passwordHash = await bcrypt.hash(data.password, 10);

    const user = await this.prisma.user.create({
      data: {
        address: data.address,
        email: data.email,
        name: data.name,
        cpf: data.cpf,
        phone: data.phone,
        number: data.number,
        complement: data.complement,
        zipCode: data.zipCode,
        neighborhood: data.neighborhood,
        city: data.city,
        state: data.state,
        passwordHash,
      },
    });

    const { passwordHash: _, ...result } = user;

    return result;
  }

  async findOne(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }
}
