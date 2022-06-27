import { BelongsTo, Column, DataType, ForeignKey, HasMany, Model, Table } from "sequelize-typescript";
import User from "./User";


@Table
export default class Message extends Model {
    @Column({
        primaryKey: true,
        autoIncrement: true
    })
    id: number;

    @BelongsTo(() => User, 'senderId')
    sender: User;

    @ForeignKey(() => User)
    @Column
    senderId: number;

    @BelongsTo(() => User, 'receiverId')
    receiver: User

    @ForeignKey(() => User)
    @Column
    receiverId: number;

    @Column({
        type: DataType.TEXT
    })
    content: string;
}