import { AllowNull, Column, DataType, HasOne, Index, Model, Table, ForeignKey, BelongsTo, HasMany } from "sequelize-typescript";
import Lesson from "./Lesson";
import Topic from "./Topic";
import User from "./User";

@Table
class Course extends Model {
    @Column
    name: string

    @Column(DataType.TEXT)
    description: string

    @Column
    imageUrl: string

    @Column
    slug: string

    @Column({
        defaultValue: true
    })
    isPublic: boolean

    @ForeignKey(() => Topic)
    @Column
    topicId: number;

    @BelongsTo(() => Topic)
    topic: Topic;

    @HasMany(() => Lesson)
    lessons: Lesson[];
}

export default Course;