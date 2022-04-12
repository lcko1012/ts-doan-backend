require('dotenv').config();
import App from "app";
import { GlobalErrorHandler } from "middlewares/GlobalErrorHandler";
import { CurrentUserChecker, PreAuthorize } from "middlewares/JwtFilter";
import "reflect-metadata"
import { useContainer, useExpressServer } from "routing-controllers";
import Container from "typedi";

useContainer(Container);

const app = new App();
app.bootstrap();

useExpressServer(app.getServer(), {
    routePrefix: '/api',
    development: true,
    defaultErrorHandler: false,
    controllers: [__dirname + "/controllers/*.ts"],
    middlewares: [GlobalErrorHandler],
    authorizationChecker: PreAuthorize,
    currentUserChecker: CurrentUserChecker
}) 

app.listen();