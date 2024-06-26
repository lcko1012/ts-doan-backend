import { Column, DataType, Model, Table, ForeignKey, BelongsTo, HasMany, CreatedAt, UpdatedAt, BelongsToMany, Index } from "sequelize-typescript";
import Category from "./Category";
import Feedback from "./Feedback";
import Lesson from "./Lesson";
import User from "./User";
import UserCourse from "./UserCourse";

@Table
class Course extends Model {
    @Index
    @Column
    name: string

    @Column(DataType.TEXT)
    description: string

    @Column
    subtitle: string

    @Column
    imageLink: string

    @Column
    slug: string

    @Column({
        type: DataType.DOUBLE(10, 2)
    })
    rating: number;

    @Column({
        defaultValue: false
    })
    isPublic: boolean

    @BelongsTo(() => Category, {
        foreignKey: {
            allowNull: true
        }
    })
    category?: Category

    @ForeignKey(() => Category)
    @Column
    categoryId?: number

    @HasMany(() => Lesson)
    lessons: Lesson[];

    //Student list
    @BelongsToMany(() => User, () => UserCourse, 'userId')
    users: User[];

    @HasMany(() => UserCourse)
    userCourses: UserCourse[]

    //Teacher associated with this course
    @ForeignKey(() => User)
    @Column
    teacherId: number;

    @BelongsTo(() => User, 'teacherId')
    teacher: User;

    @HasMany(() => Feedback)
    feedbacks: Feedback[]

    @CreatedAt
    @Column({
        allowNull: true
    })
    createdAt: Date;
    
    @UpdatedAt
    @Column({
        allowNull: true
    })
    updatedAt: Date;

    lessonCount: number;
}

export default Course;