import { BelongsTo, Column, DataType, ForeignKey, HasMany, Model, Table } from "sequelize-typescript";
import Question from "./Question";
import User from "./User";
import Course from './Course'

@Table
export default class Feedback extends Model {
    @Column({
        primaryKey: true,
        autoIncrement: true
    })
    id: number;

    @Column({
        type: DataType.TEXT
    })
    content: string;

    @Column
    rating: number

    @BelongsTo(() => User)
    user: User;

    @ForeignKey(() => User)
    @Column
    userId: number;

    @BelongsTo(() => Course)
    course: User;

    @ForeignKey(() => Course)
    @Column
    courseId: number;
}