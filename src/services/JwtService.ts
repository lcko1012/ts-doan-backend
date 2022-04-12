import { Service } from "typedi";
import jwt, {JwtPayload, TokenExpiredError} from "jsonwebtoken";
import { ForbiddenError } from "routing-controllers";

@Service()
export default class JwtService {
    private readonly ACCESS_KEY: string;
    private readonly REFRESH_KEY: string;

    constructor() {
        this.ACCESS_KEY = process.env.ACCESS_KEY;
        this.REFRESH_KEY = process.env.REFRESH_KEY;
    }

    public async createAccessToken(payload: any) {
        const accessToken = jwt.sign(payload, this.ACCESS_KEY, {expiresIn: '1d'})
        return accessToken;
    }

    public async createRefreshToken(payload: any) {
        const refreshToken = jwt.sign(payload, this.REFRESH_KEY, {expiresIn: '7d'})
        return refreshToken;
    }

    public isValidAcessToken(token: string) {
        try {
            jwt.verify(token, this.ACCESS_KEY);
            return true;
        }catch(err) {
            if (err instanceof TokenExpiredError) {
                return false;
            }
            throw new ForbiddenError("Invalid token");
        }
    }

    public getPayload(accessToken: string) {
        try {
            const payload = jwt.verify(accessToken, this.ACCESS_KEY) as JwtPayload;
            let {id, email, role} = payload;

            return {
                id: Number(id),
                email: email as string,
                role: role as string
            }
        }catch(err) {
            throw new ForbiddenError("Invalid token");
        }
    }
}