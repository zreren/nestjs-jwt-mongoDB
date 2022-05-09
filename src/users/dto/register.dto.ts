import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";

export class registerDto {
    @IsNotEmpty()
    @IsString()
    username: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(4)
    password: string;
}