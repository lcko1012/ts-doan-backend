import { AllowNull, Column, DataType, HasOne, Index, Model, Table, ForeignKey, BelongsTo } from "sequelize-typescript";
import Definition from "./Definition";
import User from "./User";

@Table
class Example extends Model {
    @Column({
        primaryKey: true,
        autoIncrement: true
    })
    id: number;
    
    @Column
    sentence: string

    @Column
    mean: string

    @ForeignKey(() => Definition)
    @Column
    definitionId: number;

    @BelongsTo(() => Definition)
    definition: Definition;
}

export default Example;