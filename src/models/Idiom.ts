import { AllowNull, Column, DataType, HasOne, Index, Model, Table, ForeignKey, BelongsTo } from "sequelize-typescript";
import Kind from "./Kind";

@Table
class Idiom extends Model {
    @Column({
        primaryKey: true,
        autoIncrement: true
    })
    id: number;
    
    @Column
    name: string

    @Column
    mean: string

    @ForeignKey(() => Kind)
    @Column
    kindId: number;

    @BelongsTo(() => Kind)
    kind: Kind;
}

export default Idiom;