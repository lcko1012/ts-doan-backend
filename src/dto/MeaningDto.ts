import { Type } from 'class-transformer';
import { IsNotEmpty, IsOptional, ValidateNested } from 'class-validator';
import { ExampleDto } from './WordDto';


export class MeaningUpdateDto {
    // id: number;
    @IsNotEmpty({message: "Định nghĩa không được để trống"})
    name: string;
    
    @IsOptional()
    @ValidateNested({each: true})
    @Type(() => ExampleDto)
    examples: ExampleDto[];

    @IsNotEmpty({message: "Không xác định được từ loại"})
    wordKindId: number;

}