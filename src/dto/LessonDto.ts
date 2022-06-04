import { IsNotEmpty, MaxLength } from "class-validator";

export class LessonCreatingDto {
    @IsNotEmpty({message: "Tên bài học không được để trống"})
    @MaxLength(120, {message: "Tên bài học không được dài quá 120 ký tự"})
    name: string;

    @IsNotEmpty()
    courseId: number;
}   