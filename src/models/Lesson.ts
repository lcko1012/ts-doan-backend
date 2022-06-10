import { BelongsTo, Column, DataType, ForeignKey, HasMany, Index, Model, Table } from "sequelize-typescript";
import Course from "./Course";
import Content from "./Content";
import Word from "./Word";
import Test from "./Test";

@Table
export default class Lesson extends Model {
    @Index
    @Column
    name: string;

    @Column
    slug: string;
    
    @Column
    lessonNo: number;

    @Column({
        type: DataType.TEXT
    })
    content: string;
    
    @HasMany(() => Word)
    words: Word[];

    @HasMany(() => Content)
    contents: Content[];

    @ForeignKey(() => Course)
    @Column
    courseId: number;

    @BelongsTo(() => Course)
    course: Course;

    @HasMany(() => Test)
    tests: Test[];
}