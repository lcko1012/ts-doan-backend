import { AllowNull, Column, DataType, HasOne, Index, Model, Table, ForeignKey, BelongsTo, HasMany } from "sequelize-typescript";
import User from "./User";
import Word from "./Word";

@Table
class Folder extends Model {
    @Index
    @Column
    name: string

    @Column
    slug: string

    @HasMany(() => Word)
    words?: Word[]

    @ForeignKey(() => User)
    @Column
    userId: number;

    @BelongsTo(() => User)
    user: User;
}

export default Folder;