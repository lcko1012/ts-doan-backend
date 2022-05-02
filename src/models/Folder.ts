import { AllowNull, Column, DataType, HasOne, Index, Model, Table, ForeignKey, BelongsTo } from "sequelize-typescript";
import User from "./User";

@Table
class Folder extends Model {
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

    @ForeignKey(() => User)
    @Column
    userId: number;

    @BelongsTo(() => User)
    user: User;
}

export default Folder;