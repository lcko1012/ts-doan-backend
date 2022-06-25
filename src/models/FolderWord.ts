import { BelongsTo, Column, ForeignKey, Model, Table } from "sequelize-typescript";
import Folder from "./Folder";
import Lesson from "./Lesson";
import Word from "./Word";

@Table({
    tableName: 'folder_word'
})
export default class FolderWord extends Model {
    @Column({
        primaryKey: true,
        autoIncrement: true
    })
    id: number;

    @ForeignKey(() => Word)
    @Column
    wordId: number;

    @BelongsTo(() => Word)
    word: Word

    @ForeignKey(() => Folder)
    @Column
    folderId: number;

    @BelongsTo(() => Folder)
    folder: Folder
}