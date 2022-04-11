import { createExpressServer } from "routing-controllers";
import { HelloWorldController } from "./controllers/HelloWorldController";

const PORT = 8080;

console.info(`Starting server on port ${PORT}`);

const routes = [HelloWorldController];

const app = createExpressServer(
    {
        controllers: [__dirname + "/controllers/*.ts"],
        cors: {
            origin: "*",
            //origin: real path
        }
    }
)

app.listen(PORT);