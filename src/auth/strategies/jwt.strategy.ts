import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from 'passport-jwt';
import { User } from "src/users/models/users.model";
import { AuthService } from "../auth.service";
import { JwtPayload } from "../models/jwt-payload.model";
import { JwtModule } from '@nestjs/jwt';
import { verify } from 'jsonwebtoken';

var fs = require('fs')
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private readonly authService: AuthService,
    ) {
        super({
            jwtFromRequest: authService.returnJwtExtractor(),
            ignoreExpiration: false,
            secretOrKey: JwtStrategy.getPublicKey(),
            algorithms: ['RS256'],
        });
    }
    async validate(jwtPayload: JwtPayload): Promise<User> {
        console.log('validate')
        const user = await this.authService.validateUser(jwtPayload);
        console.log(user);
        if (!user) {
            throw new UnauthorizedException();
        }
        return user;
    }
    static getPublicKey(): string | Buffer {
        return fs.readFileSync('./public.key', 'utf8')
    }
    static getPrivateKey(): string | Buffer {
        var fs = require('fs');
        return fs.readFileSync('./private.key', 'utf8')
    }
}