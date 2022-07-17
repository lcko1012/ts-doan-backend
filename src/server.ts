import "reflect-metadata"
require('dotenv').config();
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import App from './app';
import { GlobalErrorHandler } from "./middlewares/GlobalErrorHandler";
import { CurrentUserChecker, PreAuthorize } from "./middlewares/JwtFilter";
import { useContainer, useExpressServer} from "routing-controllers";
import Container from "typedi";
import Websocket from './websocket/websocket'
import MessageSocket from './websocket/message.socket'
import sequelize from "./models/index";
import AuthController from "./controllers/AuthController";
import CategoryController from "./controllers/CategoryController";
import ContentController from "./controllers/ContentController";
import CourseController from "./controllers/CourseController";
import ExampleController from "./controllers/ExampleController";
import FeedbackController from "./controllers/FeedbackController";
import FolderController from "./controllers/FolderController";
import IdiomController from "./controllers/IdiomController";
import KindController from "./controllers/KindController";
import LessonController from "./controllers/LessonController";
import MeaningController from "./controllers/MeaningController";
import MessageController from "./controllers/MessageController";
import QuestionController from "./controllers/QuestionController";
import StreamController from "./controllers/StreamController";
import TestController from "./controllers/TestController";
import UploadController from "./controllers/UploadController";
import UserController from "./controllers/UserController";
import UserCourseController from "./controllers/UserCourseController";
import UserTestController from "./controllers/UserTestController";
import WordController from "./controllers/WordController";
import WordKindController from "./controllers/WordKindController";

useContainer(Container);

const app = new App();
app.bootstrap();

const newApp = useExpressServer(app.getServer(), {
    routePrefix: '/api',
    // development: true,
    defaultErrorHandler: false,
    controllers: [
        AuthController,
        CategoryController,
        ContentController,
        CourseController,
        ExampleController,
        FeedbackController,
        FolderController,
        IdiomController,
        KindController,
        LessonController,
        MeaningController,
        MessageController,
        QuestionController,
        StreamController,
        TestController,
        UploadController,
        UserController,
        UserCourseController,
        UserTestController,
        WordController,
        WordKindController
    ] ,
    middlewares: [GlobalErrorHandler],
    authorizationChecker: PreAuthorize,
    currentUserChecker: CurrentUserChecker
})

const port = process.env.PORT || 5000;

const httpServer = require('http').Server(newApp);
const io = Websocket.getInstance(httpServer);

io.initializeHandlers([
    { path: '/message', handler: new MessageSocket() }
]);

sequelize.sync().then(() => {
    console.log('Database initialized');
    httpServer.listen(port, '0.0.0.0', () => {
        console.log(`This is working in port ${port}`);
    })
}).catch(err => console.error(`Database initialization error: ${err}`))

