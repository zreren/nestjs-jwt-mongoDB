import { Body, Request,Controller, Get, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { loginDto } from './dto/login.dto';
import { registerDto } from './dto/register.dto';
import { User } from './models/users.model';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {

    }
  //用户注册
    @Post('register')
    @HttpCode(HttpStatus.CREATED)
    public async register(@Body() registerDto: registerDto): Promise<User> {
        return this.usersService.register(registerDto);
    }
  //用户登录
    @Post('login')
    @HttpCode(HttpStatus.OK)
    public async login(@Body() loginDto: loginDto): Promise<{
        username: string, jwtToken: string
    }> {
        return this.usersService.loginIn(loginDto);
    }
  //获取用户profile
    @Get('me')
    @HttpCode(HttpStatus.OK)
    @UseGuards(AuthGuard('jwt'))
    public async findProtofile(@Request() request): Promise<User[]> {
        console.log('going to got')
       return request.user    
    }
}
