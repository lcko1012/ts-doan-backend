import { IsNotEmpty, IsString, MaxLength } from "class-validator";

export class ExampleRequest {
    @IsNotEmpty({ message: "Word không được để trống"})
    wordId: number;

    @IsNotEmpty({ message: "Meaning Id không được để trống" })
    meaningId: number;

    @IsNotEmpty({ message: "Definition Id không được để trống" })
    definitionId: number;

    @IsNotEmpty({ message: 'Example không được để trống' })
    example: Example;
}

export interface Example {
    id?: string;
    sentence: string;
    mean: string;
}