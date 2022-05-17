import { Column, HasMany, Model, Table } from "sequelize-typescript";
import Course from "./Course";

@Table
class Category extends Model {
    @Column
    name: string

    @HasMany(() => Course, {
        onDelete: 'no action'
    })
    courses: Course[]
}

export default Category;