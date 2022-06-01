import { IsNotEmpty, IsOptional, Min } from "class-validator";

export default class PageRequest {
    @IsOptional()
    @Min(0, {message: "Size must be greater than or equal to 0"})
    size: number = 10;

    @IsOptional()
    @Min(0, {message: "Page number must be greater than or equal to 0"})
    page: number = 0;

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

}