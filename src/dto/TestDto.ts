import {Min, IsNotEmpty, IsNumber, MaxLength, MinLength } from "class-validator";

export default class TestCreateDto {
    @IsNotEmpty()
    @MaxLength(255)
    name: string;

    @IsNotEmpty()
    lessonId: number;
}

export class TestUpdateDto extends TestCreateDto {
    @IsNotEmpty()
    @IsNumber()
    @Min(1)
    timeLimit: number;

    @IsNotEmpty()
    @IsNumber()
    @Min(0)
    passingScore: number;
}

class QuestionSubmit {
    @IsNotEmpty()
    questionId: number;
    answerId: number;
    answerContent: string;
}

export class TestSubmitDto {
    id: number;
    lessonId: number;
    @IsNotEmpty()
    questions: QuestionSubmit[];
}