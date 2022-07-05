import {Min, IsNotEmpty, IsNumber, MaxLength, MinLength, IsOptional, IsString } from "class-validator";

export default class UserUpdate {
    @IsOptional()
    @MaxLength(255)
    @IsString()
    name: string;

    @IsOptional()
    @MinLength(6, {
        message: "Password must be at least 6 characters long"
    })
    @IsNotEmpty()
    password: string;

    @IsOptional()
    @MinLength(6)
    @IsNotEmpty()
    password_confirmation: string;
}
