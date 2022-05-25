import { IsEmail, IsEnum, IsNotEmpty, IsString } from "class-validator";
import PasswordDto from "./PasswordDto";

export default class RegisterDto extends PasswordDto {
    @IsNotEmpty()
    name: string;

    @IsNotEmpty()
    @IsEmail({}, { message: "Email is not valid" })
    email: string;

    @IsEnum(["ROLE_USER", "ROLE_TEACHER"])
    role: string;
}