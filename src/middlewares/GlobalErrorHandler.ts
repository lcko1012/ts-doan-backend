import { ExpressErrorMiddlewareInterface, Middleware } from "routing-controllers";
import { Service } from "typedi";


@Middleware({type: "after"})
@Service()
export class GlobalErrorHandler implements ExpressErrorMiddlewareInterface {
    error(error: any, request: any, response: any, next: (err?: any) => any) {
        console.log(error);
        return response.status(error.httpCode ?? 500).json(error);
    }
}