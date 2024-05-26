import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async signIn(email: string, password: string) {
    const user = await this.userService.findOne(email);
    if (!user) {
      throw new UnauthorizedException();
    }

    const passwordMatch = await bcrypt.compare(password, user.passwordHash);

    if (!passwordMatch) {
      throw new UnauthorizedException();
    }

    const payload = {
      email: user.email,
      sub: user.id,
      roles: user.isAdmin ? ['ADMIN'] : [],
    };

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
