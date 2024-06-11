import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from './entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
// import { LocalStrategy } from './strategies/local.strategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.register({
      secret: 'abc123',
      signOptions: {
        expiresIn: '1h',
      },
    }),
    PassportModule,
  ],
  controllers: [UserController],
  // providers: [UserService, LocalStrategy],
  providers: [UserService],
})
export class UserModule {}
