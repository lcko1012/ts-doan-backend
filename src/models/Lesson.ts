import { BelongsTo, Column, DataType, ForeignKey, HasMany, Index, Model, Table } from "sequelize-typescript";
import Course from "./Course";
import Video from "./Video";
import Word from "./Word";

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

    @HasMany(() => Video)
    videos: Video[];

    @ForeignKey(() => Course)
    @Column
    courseId: number;

    @BelongsTo(() => Course)
    course: Course;
}