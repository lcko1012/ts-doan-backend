import { BelongsTo, Column, DataType, ForeignKey, HasMany, Model, Table } from "sequelize-typescript";
import Test from "./Test";
import QuestionType from "./QuestionType";
import User from "./User";

@Table({
    tableName: "user_test"
})
export default class UserTest extends Model {
    @Column
    score: number;

    @Column
    details: string;

    @ForeignKey(() => User)
    @Column
    userId: number;

    @ForeignKey(() => Test)
    @Column
    testId: number;
}