import { AllowNull, Column, DataType, HasOne, Index, Model, Table, ForeignKey, BelongsTo, Scopes } from "sequelize-typescript";
import Kind from "./Kind";
import WordKind from "./WordKind";

@Scopes(() => ({
    do_not_get_time: {
        attributes: {
            exclude: ["createdAt", "updatedAt"]
        }
    },
}))
@Table
class Idiom extends Model {
    @Column({
        primaryKey: true,
        autoIncrement: true
    })
    id: number;
    
    @Column({
        type: DataType.TEXT
    })
    name: string

    @Column({
        type: DataType.TEXT
    })
    mean: string

    @ForeignKey(() => WordKind)
    @Column
    wordKindId: number;

    @BelongsTo(() => WordKind, {
        onDelete: 'CASCADE',
    })
    wordKind: WordKind;

    // @ForeignKey(() => Kind)
    // @Column
    // kindId: number;

    // @BelongsTo(() => Kind)
    // kind: Kind;
}

export default Idiom;