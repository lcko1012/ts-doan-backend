import {Sequelize} from 'sequelize-typescript';
import Course from './Course';
import Definition from './Definition';
import Example from './Example';
import Extra from './Extra';
import Folder from './Folder';
import Lesson from './Lesson';
import Meaning from './Meaning';
import PasswordResetToken from './PasswordResetToken';
import Topic from './Topic';
import User from './User';
import Word from './Word';

const sequelize = new Sequelize({
    database: process.env.DB_NAME,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    dialect: 'mysql',
    pool: {
        max: 5,
        min: 0,
        acquire: 20000,
        idle: 10000
    },
    dialectOptions: {
        connectTimeout: process.env.NODE_ENV == "production" ? 5000 : 15000
    }
})


sequelize.addModels([
    User, PasswordResetToken, Word, Meaning, Definition, Extra, Example,
    Folder, Course, Lesson, Topic
]);

export default sequelize;