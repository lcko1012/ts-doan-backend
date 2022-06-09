import { IsNotEmpty, IsOptional, MaxLength, maxLength } from "class-validator";

export class ContentCreateingDto {
    @IsNotEmpty({ message: "Tên bài giảng không được để trống" })
    @MaxLength(255, { message: "Tên bài giảng không được dài quá 255 ký tự" })
    name: string;

    @IsOptional()
    content:string;

    @IsOptional()
    path:string;

    @IsNotEmpty({ message: "Bạn chưa lựa chọn thể loại của bài giảng" })
    type: string;

    @IsNotEmpty()
    lessonId: number;
}
