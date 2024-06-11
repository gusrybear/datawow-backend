import { Controller, Get, Post, Body, Param, Res, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UserPayloadDto } from './dto/user.dto';
import { Request, Response } from 'express';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Post('login')
  async login(
    @Body() userPayloadDto: UserPayloadDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const jwt = await this.userService.signIn(userPayloadDto);
    response.cookie('jwt', jwt, { httpOnly: true });
    return {
      message: 'success',
    };
  }

  @Get()
  async user(@Req() request: Request) {
    return await this.userService.user(request);
  }

  @Post('logout')
  async logout(@Res({ passthrough: true }) response: Response) {
    return await this.userService.logout(response);
  }
}
