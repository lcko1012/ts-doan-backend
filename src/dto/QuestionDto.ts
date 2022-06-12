import { Transform  } from "class-transformer";
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, MinLength } from "class-validator";

export default class QuestionUpdateDto {
    @IsNotEmpty()
    @IsString()
    @Transform((value: string) => value.trim())
    content: string;
    
    @IsEnum(["TYPE_MULTIPLECHOICE", "TYPE_TEXT"])
    type: string;

    @IsNotEmpty()
    @IsNumber()
    score: number;

    imageLink: string;

    audioLink: string;

    @IsNotEmpty()
    testId: number;

    @IsNotEmpty()
    answers: AnswerCreateDto[] | [];
}

export class QuestionCreateDto {
    @IsEnum(["TYPE_MULTIPLECHOICE", "TYPE_TEXT"])
    type: string;

    @IsNotEmpty()
    testId: number;
}

export class AnswerCreateDto {
    @IsOptional()
    id: number;

    @IsNotEmpty()
    @IsString()
    @Transform((value: string) => value.trim())
    content: string;

    @IsNotEmpty()
    correct: boolean;

    @IsNotEmpty()
    questionId: number;
}