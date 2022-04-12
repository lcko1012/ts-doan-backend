import { Service } from "typedi";
import jwt, {JwtPayload, TokenExpiredError} from "jsonwebtoken";

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
}