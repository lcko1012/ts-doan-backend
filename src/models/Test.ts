import { BelongsTo, BelongsToMany, Column, DataType, ForeignKey, HasMany, Model, Table } from "sequelize-typescript";
import Lesson from "./Lesson";
import User from "./User";
import UserTest from "./UserTest";


@Table
export default class Test extends Model {
    @Column({
        type: DataType.STRING(5)
    })
    timeLimit: number;
   
    @Column
    passingScore: number;

    @BelongsTo(() => Lesson)
    lesson: Lesson;

    @ForeignKey(() => Lesson)
    @Column
    lessonId: number;

    @BelongsToMany(() => User, () => UserTest)
    users: User[];
}