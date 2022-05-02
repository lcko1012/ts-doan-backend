import { AllowNull, Column, DataType, HasOne, Index, Model, Table, ForeignKey, BelongsTo, HasMany, Scopes } from "sequelize-typescript";
import Example from "./Example";
import User from "./User";
import Meaning from './Meaning'

@Scopes(() => ({
    do_not_get_time: {
        attributes: {
            exclude: ["createdAt", "updatedAt"]
        }
    }
}))
@Table
class Definition extends Model {
    @Column({
        primaryKey: true,
        autoIncrement: true
    })
    id: number;

    @Column
    mean: string
 
    @HasMany(() => Example)
    examples: Example[];

    @ForeignKey(() => Meaning)
    @Column
    meaningId: number;

    @BelongsTo(() => Meaning)
    Meaning: Meaning;
}

export default Definition;