import { IsNotEmpty, IsOptional, IsString, MaxLength } from "class-validator";

export class UpdateWordDto {
  @IsNotEmpty({ message: "Word must not be empty" })
  @MaxLength(255, { message: "Word must not be longer than 255 characters" })
  vocab: string;

  @IsNotEmpty({ message: "Phonetic must not be empty" })
  @MaxLength(255, { message: "Phonetic must not be longer than 255 characters" })
  phonetic: string;

  imageLink: string;

  audios: string;
}

class WordKindDto {
  @IsOptional()
  wordId: number;
  
  @IsNotEmpty({ message: "Kind must not be empty" })
  kindId: number;

  @IsNotEmpty({ message: "Định nghĩa của loại từ không được để trống" })
  meanings: MeaningDto[];

  @IsOptional()
  idioms: IdiomDto[];
}

export class CreateWordDto {
  @IsNotEmpty({ message: "Word must not be empty" })
  @MaxLength(255, { message: "Word must not be longer than 255 characters" })
  vocab: string;

  @IsNotEmpty({ message: "Phonetic must not be empty" })
  @MaxLength(255, { message: "Phonetic must not be longer than 255 characters" })
  phonetic: string;

  @IsNotEmpty({ message: "Loại từ không được để trống" })
  kindId: number;
  
  @IsNotEmpty({ message: "Định nghĩa không được để trống" })
  meaning: string;
}

export class WordCreateKindDto {
  @IsNotEmpty({message: "Kind Id không được để trống"})
  kindId: number;

  @IsOptional()
  meanings: MeaningDto[];

  @IsOptional()
  idioms: IdiomDto[];
}

export class MeaningDto {
  @IsOptional()
  id: number;

  @IsNotEmpty({message: "Meaning không được để trống" })
  meaning: string;

  @IsOptional()
  examples: ExampleDto[];
}

export class IdiomDto {
  @IsOptional()
  id?: number;

  @IsNotEmpty({message: "Thành ngữ không được để trống" })
  name: string;

  @IsNotEmpty({message: "Nghĩa không được để trống" })
  mean: string;

  @IsNotEmpty({message: "Từ loại không thể để trống"})
  wordKindId: number;
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

export class ExampleDto {
  @IsOptional()
  id?: number;

  @IsNotEmpty({message: "Ví dụ không được để trống" })
  sentence: string;

  @IsNotEmpty({message: "Ý nghĩa không được để trống"})
  mean: string;
}


export interface ExampleType {
  id?: number;
  sentence: string;
  mean: string;
}

export interface MeaningType {
  name: string;
  examples: ExampleType[]
}

export interface IdiomType {
  name: string;
  mean: string;
}

export interface KindType {
  name: string;
  meanings: MeaningType[],
  idioms: IdiomType[]
}