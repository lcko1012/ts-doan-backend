import { AllowNull, BelongsTo, Column, DataType, ForeignKey, HasMany, HasOne, Index, Model, Table } from "sequelize-typescript";
import Lesson from "./Lesson";
import LessonContent from "./LessonContentType";


@Table
class Content extends Model {
    @Column
    name: string;
    
    @Column
    path: string;

    @Column({
        type: DataType.TEXT
    })
    content: string;

    @Column({
        type: DataType.ENUM({values: Object.keys(LessonContent)}),
    })
    type: string;

    @BelongsTo(() => Lesson)
    lesson: Lesson;

    @ForeignKey(() => Lesson)
    @Column
    lessonId: number;
}

export default Content;