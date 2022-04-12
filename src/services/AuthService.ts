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

    public createPasswordResetToken = async (email: string) => {
        const user = await this.userRepository.findByEmail(email);

        if (!user) {
            throw new NotFoundError("Email not found");
        }

        if (!user.activated) {
            throw new HttpError(StatusCodes.CONFLICT, "Email is not activated");
        }

        const newToken = crypto.randomBytes(16).toString("hex");
        const expireDate = new Date(Date.now() + 60000*30); //30 minutes
        
        let passwordResetToken = await PasswordResetToken.findOne({
            where: {userId: user.id}
        })

        if (passwordResetToken) {
            passwordResetToken.expireDate = expireDate;
        }
        else {
            passwordResetToken = PasswordResetToken.build({
                userId: user.id,
                token: newToken,
                expireDate
            })
        }

        passwordResetToken = await passwordResetToken.save();

        let passwordResetLink = `${process.env.CLIENT_URL}/reset_password/${passwordResetToken.token}`;
        
        this.mailSender.sendPasswordResetLink(email, passwordResetLink);
    }

    public validatePasswordResetToken = async (token: string) => {
        const passwordResetToken = await PasswordResetToken.findOne({
            where: {token}
        })

        if (!passwordResetToken) {
            throw new UnauthorizedError("Invalid token");
        }

        if (passwordResetToken.expireDate < new Date()) {
            throw new UnauthorizedError("Token expired");
        }
    }

    public resetPassword = async (token: string, newPasswrd: string) => {
        await this.validatePasswordResetToken(token);

        const passwordResetToken = await PasswordResetToken.findOne({
            where: {token},
            include: [User]
        });

        if (passwordResetToken) {
            const user = passwordResetToken.user;
            user.password = await this.encryptPassword(newPasswrd);
            await user.save();
            await passwordResetToken.destroy();
        }
        else {
            throw new UnauthorizedError("Invalid token");
        }
    }
}