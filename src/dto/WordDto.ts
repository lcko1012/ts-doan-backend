import { IsNotEmpty, IsString, MaxLength } from "class-validator";

export class UpdateWordDto {
  @IsNotEmpty({ message: "Word must not be empty" })
  @MaxLength(255, { message: "Word must not be longer than 255 characters" })
  vocab: string;

  @IsNotEmpty({ message: "Phonetic must not be empty" })
  @MaxLength(255, { message: "Phonetic must not be longer than 255 characters" })
  phonetic: string;

  @IsNotEmpty({ message: "Meaning must not be empty" })
  meaning: string;

  audios: string;
}


export class ExampleRequest {
  @IsNotEmpty({message: "Meaning Id không được để trống" })
  meaningId: number;

  @IsNotEmpty({message: "Definition Id không được để trống" })
  definitionId: number;

  @IsNotEmpty({message: 'Example không được để trống'})
  example: ExampleType;

  @IsNotEmpty()
  action: string;
}

interface Extra {
  name: string;
  mean: string[]
}

export interface ExampleType {
  id: number;
  sentence: string;
  mean: string;
}

interface DefinitionType {
  mean: string;
  examples: ExampleType[]
}

export interface MeaningType {
  kind: string;
  definition: DefinitionType[] | [];
  extra: Extra[] | [];
}

export class ExampleClass {
  id: number;
  sentence: string;
  mean: string;
}