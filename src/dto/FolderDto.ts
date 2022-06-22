import { IsNotEmpty, IsOptional, MaxLength, maxLength } from "class-validator";

export class FolderCreateingDto {
    @IsNotEmpty({ message: "Tên bài giảng không được để trống" })
    @MaxLength(255, { message: "Tên bài giảng không được dài quá 255 ký tự" })
    name: string;
}
