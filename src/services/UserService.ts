import UserRepository from "../repository/UserRepository";
import { Service } from "typedi";
import { NotFoundError } from "routing-controllers";
import User from "models/User";

@Service()
export default class UserService {
    constructor(
        private userRepository: UserRepository,
    ){}

    public async getUserByEmail(email: string) {
        const user = await this.userRepository.findByEmailAndActivated(email);

        if (!user) throw new NotFoundError("User not found");
        return this.sanitizaUser(user);
    }

    private sanitizaUser(user: User) {
        return {
            id: user.id,
            name: user.name,
            email: user.email,
            avatarLink: user.avatarLink,
            locked: user.locked,
            activated: user.activated,
            role: user.role,
        };
    }
}