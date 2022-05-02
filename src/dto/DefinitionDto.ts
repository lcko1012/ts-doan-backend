import { Type } from 'class-transformer';
import { IsNotEmpty, IsOptional, ValidateNested } from 'class-validator';
// import {Example} from './ExampleDto'


class Example {
    id?: number;

    @IsNotEmpty({ message: 'Example không được để trống' })
    sentence: string;

    @IsNotEmpty({ message: 'Mean không được để trống' })
    mean: string;
}

export class DefinitionUpdatingDto {
    id: number;
    @IsNotEmpty({message: "Ý nghĩa không được để trống"})
    mean: number;
    
    @IsOptional()
    @ValidateNested({each: true})
    @Type(() => Example)
    examples: Example[]
}