import { Column, HasOne, Model, Table, ForeignKey, BelongsTo, DataType } from "sequelize-typescript";
import Meaning from "./Meaning";

@Table
class Example extends Model {
    @Column({
        primaryKey: true,
        autoIncrement: true
    })
    id: number;
    
    @Column({
        type: DataType.TEXT
    })
    sentence: string

    @Column({
        type: DataType.TEXT
    })
    mean: string

    @ForeignKey(() => Meaning)
    @Column
    meaningId: number;

    @BelongsTo(() => Meaning)
    meanign: Meaning;
}

export default Example;