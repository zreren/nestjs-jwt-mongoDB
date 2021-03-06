import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Request } from 'express';
import { sign } from 'jsonwebtoken';
import { Model } from 'mongoose';
import { User } from 'src/users/models/users.model';
import { JwtPayload } from './models/jwt-payload.model';

@Injectable()
export class AuthService {
    constructor(
        @InjectModel('User')
        private readonly userModel: Model<User>,
    ) {}
    public async createAccessToken(userId: string,privateKey): Promise<string> {
        const signOptions = {expiresIn:process.env.JWT_EXPIRATION,algorithm:"RS256"}
        return sign({userId}, privateKey, {expiresIn:process.env.JWT_EXPIRATION,algorithm:"RS256"})
    }

    public async validateUser(jstPayload: JwtPayload): Promise<User> {
        const user = await this.userModel.findOne({ _id: jstPayload.userId});
        if(!user) {
            throw new UnauthorizedException('Error,user not found.');
        } 
        return user;
    }

    private static jwtExtractor(request: Request): string {
        const authHeader = request.headers.authorization;

        if(!authHeader) {
            throw new UnauthorizedException('Error,Bad request.');
        }
        const[, token] = authHeader.split(' ');

        return token;
    }

    public returnJwtExtractor(): (request: Request) => string {
        return AuthService.jwtExtractor;
    }
}
