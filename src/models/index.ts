import {Sequelize} from 'sequelize-typescript';
import PasswordResetToken from './PasswordResetToken';
import User from './User';

const sequelize = new Sequelize({
    database: process.env.DB_NAME,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    dialect: 'mysql',
    pool: {
        max: 5,
        min: 0,
        acquire: 3000,
        idle: 10000
    },
})


sequelize.addModels([
    User, PasswordResetToken
]);

export default sequelize;