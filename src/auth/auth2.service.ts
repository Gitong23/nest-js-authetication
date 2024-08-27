import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';
import { JwtService } from '@nestjs/jwt';

const scrypt = promisify(_scrypt);

@Injectable()
export class Auth2Service {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string) {
    const [user] = await this.usersService.find(email);
    if (!user) {
      throw new NotFoundException('user not found');
    }

    //password compare
    const [salt, storeHash] = user.password.split('.');
    const hash = (await scrypt(password, salt, 32)) as Buffer;

    if (storeHash !== hash.toString('hex')) {
      throw new BadRequestException('bad password');
    }

    return user;
  }

  async login(user: any) {
    const payload = { email: user.email, sub: 888 };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
