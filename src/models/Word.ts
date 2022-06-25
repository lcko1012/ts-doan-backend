import { BelongsTo, BelongsToMany, Column, CreatedAt, DataType, ForeignKey, HasMany, Index, Model, Scopes, Sequelize, Table, UpdatedAt } from "sequelize-typescript";
import Folder from "./Folder";
import Lesson from "./Lesson";
import Kind from "./Kind";
import WordKind from "./WordKind";
import LessonWord from "./LessonWord";
import FolderWord from "./FolderWord";

@Scopes(() => ({
    do_not_get_time: {
        attributes: {
            exclude: ["createdAt", "updatedAt"]
        }
    },
}))
@Table
class Word extends Model {
    @Column({
        primaryKey: true,
        autoIncrement: true
    })
    id: number;
    
    @Index
    @Column
    vocab: string;

    @Column
    phonetic: string ;

    @Column
    imageLink: string;

    @Column
    audios: string;

    @Column({
        defaultValue: true
    })
    isDict: boolean

    @BelongsToMany(() => Kind, () => WordKind, "wordId", "kindId")
    kinds: Kind[];

    @HasMany(() => WordKind)
    wordKinds: WordKind[];

    @BelongsToMany(() => Folder, () => FolderWord)
    folders: Folder[]

    @HasMany(() => FolderWord)
    folderWords: FolderWord[]

    @BelongsToMany(() => Lesson, () => LessonWord)
    lessons: Lesson[]

    @HasMany(() => LessonWord)
    lessonWords: LessonWord[]

    @CreatedAt
    @Column({
        allowNull: true
    })
    createdAt: Date;

    @UpdatedAt
    @Column({
        allowNull: true
    })
    updatedAt: Date;
}

export default Word;