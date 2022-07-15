import { IsNotEmpty, IsString, Max, MaxLength, Min } from "class-validator";

export class FeedbackDto {
    @IsNotEmpty({ message: "Nội dung không được để trống"})
    content: string;

    @IsNotEmpty({ message: "Đánh giá không được để trống" })
    @Max(5, { message: "Đánh giá không hợp lệ" })
    @Min(1, { message: "Đánh giá không hợp lệ" })
    rating: number;

    @IsNotEmpty({ message: "ID khóa học không được để trống" })
    courseId: number;
}

