import { BelongsTo, Column, ForeignKey, Model,Table } from "sequelize-typescript";
import User from "./User";
import Course from "./Course";

@Table({
    tableName: "user_course"
})
class UserCourse extends Model {
    @Column({
        primaryKey: true,
        autoIncrement: true
    })
    id: number

    @ForeignKey(() => User)
    @Column({
        unique: false
    })
    userId: number;
    
    @BelongsTo(() => User)
    user: User;

    @ForeignKey(() => Course)
    @Column({
        unique: false
    })
    courseId: number;

    @BelongsTo(() => Course)
    course: Course;

    @Column
    learningLesson: number;
}

export default UserCourse;