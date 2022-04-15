import { Column, DataType, Index, Model, Table } from "sequelize-typescript";

@Table
class Word extends Model {
    @Column({
        primaryKey: true,
        autoIncrement: true
    })
    id: number;
    
    @Index
    @Column
    word: string;

    @Column
    phonetic: string;

    @Column(DataType.TEXT)
    meaning: string;

    @Column
    audios: string;
}

export default Word;