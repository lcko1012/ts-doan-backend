import { BelongsTo, Column, DataType, ForeignKey, HasMany, Model, Table } from "sequelize-typescript";
import Course from "./Course";
import User from "./User";

@Table
export default class Topic extends Model {
    @Column
    name: string;

    @HasMany(() => Course)
    courses: Course[];
}