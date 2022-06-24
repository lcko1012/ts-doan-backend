import { IsNotEmpty, IsNumber } from "class-validator";

export class MessageDto {
    @IsNotEmpty()
    content: string;
    
    @IsNotEmpty()
    @IsNumber()
    receiverId: number
}