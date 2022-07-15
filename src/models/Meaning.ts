import { AllowNull, Column, DataType, HasOne, Index, Model, Table, ForeignKey, BelongsTo, HasMany, Scopes } from "sequelize-typescript";
import Example from "./Example";
import Kind from './Kind'
import WordKind from "./WordKind";

@Scopes(() => ({
    do_not_get_time: {
        attributes: {
            exclude: ["createdAt", "updatedAt"]
        }
    },
    with_examples: {
        include: [{
            model: Example,
        }]
    }
}))
@Table
class Meaning extends Model {
    @Column({
        primaryKey: true,
        autoIncrement: true
    })
    id: number;

    @Column({
        type: DataType.TEXT
    })
    name: string
 
    @HasMany(() => Example, {
        onDelete: 'CASCADE',
    })
    examples: Example[];

    @ForeignKey(() => WordKind)
    @Column
    wordKindId: number;

    @BelongsTo(() => WordKind, {
        onDelete: 'CASCADE',
    })
    wordKind: WordKind;
}

export default Meaning;