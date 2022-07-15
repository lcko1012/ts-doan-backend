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
import "reflect-metadata"
import sequelize from "./models/index";

useContainer(Container);

const app = new App();
app.bootstrap();

const newApp = useExpressServer(app.getServer(), {
    routePrefix: '/api',
    development: true,
    defaultErrorHandler: false,
    controllers: [__dirname + "/controllers/*.ts"],
    middlewares: [GlobalErrorHandler],
    authorizationChecker: PreAuthorize,
    currentUserChecker: CurrentUserChecker
})

const port = process.env.APP_PORT || 5000;

const httpServer = require('http').Server(newApp);
const io = Websocket.getInstance(httpServer);

io.initializeHandlers([
    { path: '/message', handler: new MessageSocket() }
]);

sequelize.sync().then(() => {
    console.log('Database initialized');
    httpServer.listen(port, () => {
        console.log(`This is working in port ${port}`);
    })
}).catch(err => console.error(`Database initialization error: ${err}`))

