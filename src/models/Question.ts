import { BelongsTo, Column, DataType, ForeignKey, HasMany, Model, Table } from "sequelize-typescript";
import Test from "./Test";
import QuestionType from "./QuestionType";
import Answer from "./Answer";

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

    @Column({
        defaultValue: 0,
        type: DataType.DOUBLE
    })
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

    @HasMany(() => Answer)
    answers: Answer[];
}