import express from 'express';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import sequelize from 'models';
import cors from 'cors'

export default class App {
    private readonly app: express.Application;

    constructor(){
        this.app = express();
    }

    public listen() {
        const PORT: number = parseInt(process.env.PORT) || 1012;

        App.initDatabase().then(() => {
            console.log('Database initialized');

            this.app.listen(PORT, () => {
                console.log(`Server is running on port ${PORT}`);
            })
        }).catch(err => console.error(`Database initialization error: ${err}`));
    }

    public bootstrap() {
        this.app.use(cors({origin: "*"}))
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: true }));
        this.app.use(cookieParser());
    }

    public getServer(): express.Application {
        return this.app;
    }

    private static async initDatabase() {
        await sequelize.sync();
    }
}