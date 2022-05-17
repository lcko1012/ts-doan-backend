import { BelongsTo, Column, DataType, ForeignKey, HasMany, Model, Table } from "sequelize-typescript";
import Question from "./Question";

@Table
export default class Answer extends Model {
    @Column({
        type: DataType.TEXT
    })
    content: string;

    @Column({
        defaultValue: false
    })
    correct: boolean

    @BelongsTo(() => Question)
    question: Question;

    @ForeignKey(() => Question)
    @Column
    questionId: number;
}