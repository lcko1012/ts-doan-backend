import { BelongsTo, BelongsToMany, Column, DataType, ForeignKey, HasMany, Model, Table } from "sequelize-typescript";
import Lesson from "./Lesson";
import Question from "./Question";
import User from "./User";
import UserTest from "./UserTest";


@Table
export default class Test extends Model {
    @Column
    name: string;
    
    @Column({
        type: DataType.INTEGER,
        defaultValue: 30,
    })
    timeLimit: number;
   
    @Column({
        type: DataType.DOUBLE,
        defaultValue: 100
    })
    passingScore: number;

    @Column({
        type: DataType.DOUBLE
    })
    totalScore: number;

    @BelongsTo(() => Lesson)
    lesson: Lesson;

    @ForeignKey(() => Lesson)
    @Column
    lessonId: number;

    @BelongsToMany(() => User, () => UserTest)
    users: User[];

    @HasMany(() => Question)
    questions: Question[];
}