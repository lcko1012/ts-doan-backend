import { BelongsTo, Column, DataType, ForeignKey, HasMany, Model, Table } from "sequelize-typescript";
import Test from "./Test";
import QuestionType from "./QuestionType";
import User from "./User";

@Table({
    tableName: "user_test"
})
export default class UserTest extends Model {
    @Column({
        primaryKey: true,
        autoIncrement: true
    })
    id: number;
    
    @Column({
        type: DataType.DOUBLE
    })
    score: number;

    @Column({
        type: DataType.TEXT
    })
    details: string;

    @ForeignKey(() => User)
    @Column
    userId: number;

    @ForeignKey(() => Test)
    @Column
    testId: number;
}