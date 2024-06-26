import {  Column, Model, Table, ForeignKey, BelongsTo, HasMany, Scopes, BelongsToMany } from "sequelize-typescript";
import Meaning from './Meaning'
import Idiom from './Idiom'
import Word from "./Word";
import WordKind from "./WordKind";

@Scopes(() => ({
    do_not_get_time: {
        attributes: {
            exclude: ["createdAt", "updatedAt"]
        }
    },
}))
@Table
class Kind extends Model {
    @Column({
        primaryKey: true,
        autoIncrement: true
    })
    id: number;

    @Column
    name: string

    // @HasMany(() => Meaning)
    // meanings: Meaning[];

    // @HasMany(() => Idiom)
    // idioms: Idiom[];

    @BelongsToMany(() => Word,() => WordKind, "kindId", "wordId")
    words: Word[];

    @HasMany(() => WordKind)
    wordKinds: WordKind[];
}

export default Kind;