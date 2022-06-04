import { BelongsTo, Column, DataType, ForeignKey, HasMany, Model, Table } from "sequelize-typescript";
import Lesson from "./Lesson";
import Question from "./Question";

@Table
export default class Article extends Model {
    @Column
    name: string;
    
    @Column({
        type: DataType.TEXT
    })
    content: string;

    @BelongsTo(() => Lesson)
    lesson: Lesson;

    @ForeignKey(() => Lesson)
    @Column
    lessonId: number;
}