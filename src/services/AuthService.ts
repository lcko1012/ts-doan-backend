import crypto from "crypto";
import RegisterDto from "../dto/RegisterDto";
import UserRepository from "../repository/UserRepository";
import bcrypt from "bcrypt";
import User from "../models/User";
import MailSender from "../utils/MailSender";
import { StatusCodes } from "http-status-codes";
import { HttpError, NotFoundError, UnauthorizedError } from "routing-controllers";
import { Service } from "typedi";
import JwtService from "./JwtService";
import PasswordResetToken from "../models/PasswordResetToken";


@Service()
export default class AuthService {
    constructor(
        private userRepository: UserRepository,
        private mailSender: MailSender,
        private jwtService: JwtService
    ){}

    public encryptPassword = async (password: string) => {
        return await bcrypt.hash(password, 10);
    }

    public register = async (userData: RegisterDto) => {
        const {name, email, password} = userData;

        const user = await this.userRepository.findByEmail(email);
        if (!user) {
            const registerToken = crypto.randomBytes(16).toString("hex");

            const hashedPassword = await this.encryptPassword(password);

            await User.create({
                email,
                name,
                password: hashedPassword,
                registerToken,
            });

            const activationLink = `${process.env.CLIENT_URL}/activate/${registerToken}`;
            console.log(activationLink)
            this.mailSender.sendActivationLink(email, activationLink);
        }
        else if (user.activated) {
            throw new HttpError(StatusCodes.CONFLICT, "Email is already registered");
        }
        else {
            const registerToken = user.registerToken;
            const activationLink = `${process.env.CLIENT_URL}/activate/${registerToken}`;
            this.mailSender.sendActivationLink(email, activationLink);
        }
    }

    public activate = async (token: string) => {
        const user = await this.userRepository.findByRegisterToken(token);

        if(!user) {
            throw new UnauthorizedError("Invalid token");
        }

        user.activated = true;
        user.registerToken = null;
        await user.save();
    }
    
    public login = async (email: string, password: string) => {
        const user = await this.userRepository.findByEmail(email);

        if (!user) {
            throw new UnauthorizedError("Invalid email or password");
        }
        
        const matchedPassword = await bcrypt.compare(password, user.password);
        if (!matchedPassword) {
            throw new UnauthorizedError("Invalid email or password");
        }

        const payload = {email: user.email}

        const accessToken = await this.jwtService.createAccessToken(payload);
        const refreshToken = await this.jwtService.createRefreshToken(payload);

        return {accessToken, refreshToken};
    }


}