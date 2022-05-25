import { IsNotEmpty, MaxLength, maxLength } from "class-validator";

export class CouseCreatingDto {
    @IsNotEmpty({ message: "Tên khóa học không được để trống" })
    @MaxLength(255, { message: "Tên khóa học không được dài quá 255 ký tự" })
    name: string;

    @IsNotEmpty({ message: "Mô tả không được để trống" })
    @MaxLength(255, { message: "Mô tả không được dài quá 255 ký tự" })
    introduction: string;
    
    @IsNotEmpty({ message: "Nội dung không được để trống" })
    description: string;

    @IsNotEmpty({ message: "Bạn chưa thêm hình ảnh bìa" })
    imageUrl: string;

    @IsNotEmpty({ message: "Bạn chưa lựa chọn trạng trái" })
    isPublic: boolean;

    @IsNotEmpty({ message: "Bạn chưa lựa chọn chủ đề của khóa học" })
    topicId: number;
}