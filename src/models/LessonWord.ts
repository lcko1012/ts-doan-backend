import { BelongsTo, Column, ForeignKey, Model, Table } from "sequelize-typescript";
import Lesson from "./Lesson";
import Word from "./Word";

@Table({
    tableName: 'lesson_word'
})
export default class LessonWord extends Model {
    @Column({
        primaryKey: true,
        autoIncrement: true
    })
    id: number;

    @ForeignKey(() => Word)
    @Column
    wordId: number;

    @BelongsTo(() => Word)
    word: Word

    @ForeignKey(() => Lesson)
    @Column
    lessonId: number;

    @BelongsTo(() => Lesson)
    lesson: Lesson
}