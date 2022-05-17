import { BelongsTo, Column, DataType, ForeignKey, HasMany, Model, Table } from "sequelize-typescript";
import Test from "./Test";
import QuestionType from "./QuestionType";

@Table
export default class Question extends Model {
    @Column({
        type: DataType.TEXT
    })
    content: string;
    
    @Column({
        type: DataType.ENUM({values: Object.keys(QuestionType)}),
        allowNull: false
    })
    type: QuestionType;

    @Column
    score: number;

    @Column
    imageLink: string;

    @Column 
    audioLink: string;

    @BelongsTo(() => Test)
    test: Test;

    @ForeignKey(() => Test)
    @Column
    testId: number;
}