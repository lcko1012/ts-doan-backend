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
    @Min(1)
    passingScore: number;
}