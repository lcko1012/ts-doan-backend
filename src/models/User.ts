import { AllowNull, BelongsToMany, Column, DataType, HasMany, HasOne, Index, Model, Table } from "sequelize-typescript";
import Course from "./Course";
import Feedback from "./Feedback";
import Folder from "./Folder";
import Message from "./Message";
import PasswordResetToken from "./PasswordResetToken";
import Role from "./Role";
import Test from "./Test";
import UserCourse from "./UserCourse";
import UserTest from "./UserTest";

@Table
class User extends Model {
    @Column
    name: string;

    @Index({
        type: 'UNIQUE'
    })
    @AllowNull(false)
    @Column
    email: string;

    @AllowNull(false)
    @Column
    password: string;

    @Column({
        defaultValue: "https://res.cloudinary.com/dgp6k8yir/image/upload/v1634363145/avatar/t0attjkzsrf7uod8x06i.png"
    })
    avatarLink: string;

    @Column({
        defaultValue: false
    })
    locked: boolean;

    @Column({
        defaultValue: false
    })
    activated: boolean;

    @Column({
        type: DataType.TEXT
    })
    about: string;

    @Column
    nameLink: string;

    @Column({
        type: DataType.ENUM({values: Object.keys(Role)}),
        defaultValue: Role.ROLE_USER
    })
    role: Role;

    @Column(DataType.STRING)
    registerToken: string | null;

    @HasOne(() => PasswordResetToken)
    passwordResetToken: PasswordResetToken;
    
    @HasMany(() => Folder)
    folders?: Folder[];

    @BelongsToMany(() => Course, () => UserCourse, 'userId')
    courses?: Course[];

    @HasMany(() => Course, 'teacherId')
    ownedCourses?: Course[];

    @BelongsToMany(() => Test, () => UserTest)
    tests?: Test[];

    @HasMany(() => UserTest)
    userTests?: UserTest[];

    @HasMany(() => UserCourse)
    userCourses: UserCourse[]

    @HasMany(() => Message, 'senderId')
    sentMessages: Message[];

    @HasMany(() => Message, 'receiverId')
    receivedMessage: Message[];

    @HasMany(() => Feedback)
    feedbacks: Feedback[]

}

export default User;