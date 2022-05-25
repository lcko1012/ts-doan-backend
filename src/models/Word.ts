import { BelongsTo, BelongsToMany, Column, CreatedAt, DataType, ForeignKey, HasMany, Index, Model, Scopes, Sequelize, Table, UpdatedAt } from "sequelize-typescript";
import Folder from "./Folder";
import Lesson from "./Lesson";
import Kind from "./Kind";
import WordKind from "./WordKind";

@Scopes(() => ({
    is_dict: {
        where: {
            folderId: null,
            lessonId: null
        },
        attributes: {
            exclude: ["folderId", 'lessonId']
        }
    },
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

    @BelongsToMany(() => Kind, () => WordKind, "wordId", "kindId")
    kinds: Kind[];

    @HasMany(() => WordKind)
    wordKinds: WordKind[];

    @ForeignKey(() => Folder)
    @Column
    folderId?: number;

    @BelongsTo(() => Folder, {
        foreignKey: {
            allowNull: true
        }
    })
    folder?: Folder;

    @ForeignKey(() => Lesson)
    @Column
    lessonId?: number;

    @BelongsTo(() => Lesson, {
        foreignKey: {
            allowNull: true
        }
    })
    lesson?: Lesson;

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