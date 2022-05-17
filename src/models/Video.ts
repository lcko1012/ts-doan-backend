import { AllowNull, BelongsTo, Column, DataType, ForeignKey, HasMany, HasOne, Index, Model, Table } from "sequelize-typescript";
import Lesson from "./Lesson";


@Table
class Video extends Model {
    @Column
    name: string;
    
    @Column
    path: string;


    @BelongsTo(() => Lesson)
    lesson: Lesson;

    @ForeignKey(() => Lesson)
    @Column
    lessonId: number;
}

export default Video;