import { IsNotEmpty, MaxLength, maxLength } from "class-validator";

export class CouseCreatingDto {
    @IsNotEmpty({ message: "Tên khóa học không được để trống" })
    @MaxLength(52, { message: "Tên khóa học không được dài quá 255 ký tự" })
    name: string;

    @IsNotEmpty({ message: "Bạn chưa lựa chọn thể loại của khóa học" })
    categoryId: number;
}

export class CourseUpdateBasicDto {
    @IsNotEmpty({ message: "Tên khóa học không được để trống" })
    @MaxLength(255, { message: "Tên khóa học không được dài quá 255 ký tự" })
    name: string;

    description: string;

    @MaxLength(120, {message: "Giới không dài quá 120 ký tự"})
    subtitle: string;

    imageLink: string;

    isPublic: boolean;
}

export class ReportCourseDto {
    @IsNotEmpty()
    courseId: number;

    @IsNotEmpty()
    content: string;
}