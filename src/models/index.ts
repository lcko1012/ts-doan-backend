import {Sequelize} from 'sequelize-typescript';
import Course from './Course';
import Meaning from './Meaning';
import Example from './Example';
import Idiom from './Idiom';
import Folder from './Folder';
import Lesson from './Lesson';
import Kind from './Kind';
import PasswordResetToken from './PasswordResetToken';
import Test from './Test';
import User from './User';
import Word from './Word';
import UserCourse from './UserCourse';
import UserTest from './UserTest';
import Video from './Video';
import Question from './Question';
import Answer from './Answer';
import Category from './Category';
import WordKind from './WordKind';

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
    User, PasswordResetToken, Word, Kind, Meaning, Idiom, Example,
    Folder, Course, Lesson, Test, UserCourse, UserTest, Video,
    Question, Answer, Category, WordKind
]);

export default sequelize;