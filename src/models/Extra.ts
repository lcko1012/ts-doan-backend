import { AllowNull, Column, DataType, HasOne, Index, Model, Table, ForeignKey, BelongsTo } from "sequelize-typescript";
import Meaning from "./Meaning";

@Table
class Extra extends Model {
    @Column({
        primaryKey: true,
        autoIncrement: true
    })
    id: number;
    
    @Column
    name: string

    @Column
    mean: string

    @ForeignKey(() => Meaning)
    @Column
    meaningId: number;

    @BelongsTo(() => Meaning)
    meaning: Meaning;
}

export default Extra;