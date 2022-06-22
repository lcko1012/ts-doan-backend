import { IsNotEmpty, IsOptional, Min } from "class-validator";

export default class PageRequest {
    @IsOptional()
    @Min(0, {message: "Size must be greater than or equal to 0"})
    size: number;

    @IsOptional()
    @Min(0, {message: "Page number must be greater than or equal to 0"})
    page: number;

    @IsOptional()
    // @IsNotEmpty({message: "Keyword must not be empty"})
    keyword: string;

    @IsOptional()
    // @IsNotEmpty({message: "Phát âm không được để trống"})
    phonetic: string;

    @IsOptional()
    kindId: number;    

    @IsOptional()
    // @IsNotEmpty({message: "Nghĩa không được để trống"})
    meaning: string;

    @IsOptional()
    courseName: string;

    @IsOptional()
    topicId: number;

    @IsOptional()
    folderName: string;
}

export class UserTestRequestDto {
    @IsNotEmpty()
    @Min(0, {message: "Size must be greater than or equal to 0"})
    size: number;

    @IsNotEmpty()
    @Min(0, {message: "Page number must be greater than or equal to 0"})
    page: number;

    @IsOptional()
    name?: string;

    @IsOptional()
    createdAt?: string;
    
    @IsOptional()
    isPass?: string;
    
    @IsOptional()
    scoreOrder?: string;
}