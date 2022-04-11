import { IsNotEmpty, MinLength } from "class-validator";

export default class PasswordDto {
    @MinLength(6, {
        message: "Password must be at least 6 characters long"
    })
    @IsNotEmpty()
    password: string;

    @MinLength(6)
    @IsNotEmpty()
    password_confirmation: string;
}