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