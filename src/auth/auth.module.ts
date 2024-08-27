import { Module } from '@nestjs/common';
import { Auth2Service } from './auth2.service';
import { UsersModule } from 'src/users/users.module';
import { LocalStrategy } from './local.stategy';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './contants';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '60s' },
    }),
  ],
  providers: [Auth2Service, LocalStrategy, JwtStrategy],
  exports: [Auth2Service],
})
export class AuthModule {}
