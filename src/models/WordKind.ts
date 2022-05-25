import { BelongsTo, Column, ForeignKey, HasMany, Model, Scopes, Table } from "sequelize-typescript";
import Idiom from "./Idiom";
import Kind from "./Kind";
import Meaning from "./Meaning";
import Word from "./Word";

@Scopes(() => ({
    do_not_get_time: {
        attributes: {
            exclude: ["createdAt", "updatedAt"]
        }
    },
}))
@Table({
    tableName: 'word_kind'
})
export default class WordKind extends Model {
    @Column({
        primaryKey: true,
        autoIncrement: true
    })
    id: number;

    //Super Many-to-Many
    @ForeignKey(() => Word)
    @Column
    wordId: number;

    @ForeignKey(() => Kind)
    @Column
    kindId: number;

    @BelongsTo(() => Word)
    word: Word;

    @BelongsTo(() => Kind)
    kind: Kind;

    @HasMany(() => Meaning, {
        onDelete: 'CASCADE',
    })
    meanings: Meaning[];

    @HasMany(() => Idiom, {
        onDelete: 'CASCADE',
    })
    idioms: Idiom[];
}