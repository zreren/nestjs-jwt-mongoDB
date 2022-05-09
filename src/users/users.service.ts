import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose'
import { NotFoundError } from 'rxjs';
import { AuthService } from 'src/auth/auth.service';
import { loginDto } from './dto/login.dto';
import { registerDto } from './dto/register.dto';
import { User } from './models/users.model';

@Injectable()
export class UsersService {
    constructor(
        @InjectModel('User')
        private readonly userModel: Model<User>,
        private readonly authService: AuthService,
    ) {}

    public async register(registerDto: registerDto): Promise<User> {
        const user = new this.userModel(registerDto);
        return user.save();
    }

    public async loginIn(loginDto: loginDto): Promise<{
        username: string, jwtToken: string;
    }> {
        const user = await this.findByName(loginDto.username);
        const match = await this.checkPassword(loginDto.password, user);
        if(!match) {
            throw new NotFoundException('Invalid credentials');
        }
        const jwtToken = await this.authService.createAccessToken(user._id);
        return {
            username: user.username, jwtToken
        }
    }

    public async findAll(): Promise<User[]> {
        return this.userModel.find();
    }

    private async findByName(username: string): Promise<User>{
        const user = await this.userModel.findOne({username});
        if (!user) {
            throw new NotFoundException('user not found');
        }    
        return user;
    }

    private async checkPassword(password: string, user: User): Promise<boolean> {
        const match = await bcrypt.compare(password, user.password);
        if(!match) {
            throw new NotFoundException('Password error');
        }
        return match;
    }
}
