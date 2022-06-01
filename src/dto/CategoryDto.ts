import { IsNotEmpty, MaxLength, maxLength } from "class-validator";

export class CategoryCreatingDto {
    @IsNotEmpty({ message: "Tên thể loại không được để trống" })
    @MaxLength(255, { message: "Tên thể loại không được dài quá 255 ký tự" })
    name: string;
}