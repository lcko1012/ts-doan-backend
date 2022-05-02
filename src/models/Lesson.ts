import { BelongsTo, Column, DataType, ForeignKey, HasMany, Model, Table } from "sequelize-typescript";
import Course from "./Course";
import Word from "./Word";

@Table
export default class Lesson extends Model {
    @Column
    name: string;

    @Column(DataType.TEXT)
    description: string;

    @Column
    slug: string;

    @Column
    imageUrl: string;

    @ForeignKey(() => Course)
    @Column
    courseId: number;

    @BelongsTo(() => Course)
    course: Course;

    @HasMany(() => Word)
    words: Word[];
}