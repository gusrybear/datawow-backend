import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { UserPayloadDto } from './dto/user.dto';
import * as bcrypt from 'bcrypt';
import { Request, Response } from 'express';

export interface IUser {
  id: number;
  username: string;
}

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 12);

    const user = await this.userRepository.create({
      username: createUserDto.username,
      password: hashedPassword,
    });
    const toCreate = await this.userRepository.insert(user);
    return toCreate;
  }

  async findOne(condition: any): Promise<User> {
    return this.userRepository.findOneBy(condition);
  }

  async signIn(userPayloadDto: UserPayloadDto) {
    const user = await this.findOne({ username: userPayloadDto.username });
    if (!user) throw new BadRequestException('Invalid Credential');
    if (!(await bcrypt.compare(userPayloadDto.password, user.password))) {
      throw new BadRequestException('Invalid Credential');
    }
    const payload = { id: user.id, username: user.username };
    const jwt = await this.jwtService.signAsync(payload);
    return jwt;
  }

  async user(request: Request) {
    try {
      const cookie = request.cookies['jwt'];
      const data: {
        id: string;
        username: string;
        iat: number;
        exp: number;
      } = await this.jwtService.verifyAsync(cookie);
      if (!data) {
        throw new UnauthorizedException();
      }
      //data is ok not error then
      const user = await this.findOne({ id: data.id });
      return { id: user.id, username: user.username };
    } catch (error) {
      throw new UnauthorizedException();
    }
  }

  async logout(response: Response) {
    response.clearCookie('jwt');
    return {
      message: 'success',
    };
  }
}
