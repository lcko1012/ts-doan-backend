import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import User from "./User";

@Table({
    tableName: "password_reset_token"
})
export default class PasswordResetToken extends Model {
    @Column({
        primaryKey: true,
        autoIncrement: true
    })
    id: number;

    @Column(DataType.STRING)
    token: string | null;

    @Column
    expireDate: Date | null;

    @ForeignKey(() => User)
    @Column
    userId: number;

    @BelongsTo(() => User)
    user: User;
}