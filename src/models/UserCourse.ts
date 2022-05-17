import { Column, ForeignKey, Model,Table } from "sequelize-typescript";
import User from "./User";
import Course from "./Course";

@Table({
    tableName: "user_course"
})
class UserCourse extends Model {
    @ForeignKey(() => User)
    @Column({
        primaryKey: true
    })
    userId: number;

    @ForeignKey(() => Course)
    @Column({
        primaryKey: true
    })
    courseId: number;

    @Column
    learningLesson: number;
}

export default UserCourse;