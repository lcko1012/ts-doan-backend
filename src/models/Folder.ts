import { AllowNull, Column, DataType, HasOne, Index, Model, Table, ForeignKey, BelongsTo, HasMany, BelongsToMany } from "sequelize-typescript";
import FolderWord from "./FolderWord";
import User from "./User";
import Word from "./Word";

@Table
class Folder extends Model {
    @Index
    @Column
    name: string

    @Column
    slug: string

    @BelongsToMany(() => Word, () => FolderWord)
    words: Word[]

    @HasMany(() => FolderWord)
    folderWords: FolderWord[]

    @ForeignKey(() => User)
    @Column
    userId: number;

    @BelongsTo(() => User)
    user: User;
}

export default Folder;