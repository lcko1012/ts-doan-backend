import { IsNotEmpty, IsOptional, Min } from "class-validator";

export default class PageRequest {
    @IsOptional()
    @Min(0, {message: "Size must be greater than or equal to 0"})
    size: number;

    @IsOptional()
    @Min(0, {message: "Page number must be greater than or equal to 0"})
    page: number;

    @IsOptional()
    keyword: string;

    @IsOptional()
    phonetic: string;

    @IsOptional()
    kindId: number;    

    @IsOptional()
    meaning: string;

    @IsOptional()
    courseName: string;

    @IsOptional()
    categoryId: number;

    @IsOptional()
    folderName: string;

    @IsOptional()
    filterCategory: number[];

    @IsOptional()
    courseId: number;
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

export class UserListInCourse {
    @IsNotEmpty()
    @Min(0, {message: "Size must be greater than or equal to 0"})
    size: number;

    @IsNotEmpty()
    @Min(0, {message: "Page number must be greater than or equal to 0"})
    page: number;

    @IsOptional()
    name?: string;

    @IsOptional()
    email?: string;
    
    @IsOptional()
    joinedDate?: string;
}

export class UserListParams {
    @IsNotEmpty()
    @Min(0, {message: "Size must be greater than or equal to 0"})
    size: number;

    @IsNotEmpty()
    @Min(0, {message: "Page number must be greater than or equal to 0"})
    page: number;

    @IsOptional()
    name?: string;

    @IsOptional()
    email?: string;

    @IsOptional()
    role?: string;

    @IsOptional()
    locked?: string;
    
    // @IsOptional()
    // joinedDate?: string;
}
