import { AllowNull, Column, DataType, HasOne, Index, Model, Table, ForeignKey, BelongsTo, HasMany, Scopes } from "sequelize-typescript";
import Example from "./Example";
import Kind from './Kind'

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
    name: string
 
    @HasMany(() => Example)
    examples: Example[];

    @ForeignKey(() => Kind)
    @Column
    kindId: number;

    @BelongsTo(() => Kind)
    kind: Kind;
}

export default Meaning;