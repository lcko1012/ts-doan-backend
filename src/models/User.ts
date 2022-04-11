import { AllowNull, Column, DataType, HasOne, Index, Model, Table } from "sequelize-typescript";
import PasswordResetToken from "./PasswordResetToken";
import Role from "./Role";

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
        type: DataType.ENUM({values: Object.keys(Role)}),
        defaultValue: Role.ROLE_USER
    })
    role: Role;

    @Column(DataType.STRING)
    registerToken: string | null;

    @HasOne(() => PasswordResetToken)
    passwordResetToken: PasswordResetToken;
    
}

export default User;