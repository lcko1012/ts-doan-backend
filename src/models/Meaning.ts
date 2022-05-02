import { AllowNull, Column, DataType, HasOne, Index, Model, Table, ForeignKey, BelongsTo, HasMany, Scopes } from "sequelize-typescript";
import Definition from './Definition'
import Extra from './Extra'
import Word from "./Word";

@Scopes(() => ({
    do_not_get_time: {
        attributes: {
            exclude: ["createdAt", "updatedAt"]
        }
    }
}))
@Table
class Meaning extends Model {
    @Column({
        primaryKey: true,
        autoIncrement: true
    })
    id: number;

    @Column
    kind: string

    @HasMany(() => Definition)
    definitions: Definition[];

    @HasMany(() => Extra)
    extras: Extra[];

    @ForeignKey(() => Word)
    @Column
    wordId: number;

    @BelongsTo(() => Word)
    word: Word;
}

export default Meaning;