import { BelongsTo, Column, CreatedAt, DataType, ForeignKey, HasMany, Index, Model, Scopes, Sequelize, Table } from "sequelize-typescript";
import Definition from "./Definition";
import Folder from "./Folder";
import Lesson from "./Lesson";
import Meaning from "./Meaning";

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
    imageUrl: string;

    @Column
    audios: string;

    @HasMany(() => Meaning)
    meanings: Meaning[];
    
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

    @CreatedAt
    @Column({
        allowNull: true
    })
    updatedAt: Date;
}

export default Word;