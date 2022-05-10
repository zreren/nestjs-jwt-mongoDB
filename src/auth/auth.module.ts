import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersSchema } from '../users/schemas/user.schema';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.strategy';
@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'User',
        schema: UsersSchema
      }
    ]),
    PassportModule,
    JwtModule.register({
      publicKey: JwtStrategy.getPublicKey(),
      privateKey:JwtStrategy.getPrivateKey(),
      signOptions: {
        expiresIn:process.env.JWT_EXPIRATION,algorithm:"RS256"
      }
    })
  ],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService]
})
export class AuthModule {}
