import { Column, ForeignKey, Model, Table } from "sequelize-typescript";
import Kind from "./Kind";
import Word from "./Word";

@Table({
    tableName: 'word_kind'
})
export default class WordKind extends Model {
    @ForeignKey(() => Word)
    @Column
    wordId: number;

    @ForeignKey(() => Kind)
    @Column
    kindId: number;
}