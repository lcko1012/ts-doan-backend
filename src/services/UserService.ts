import UserRepository from "../repository/UserRepository";
import { Service } from "typedi";
import { NotFoundError } from "routing-controllers";

@Service()
export default class UserService {
    constructor(
        private userRepository: UserRepository,
    ){}

    public async getUserByEmail(email: string) {
        const user = await this.userRepository.findByEmailAndActivated(email);

        if (!user) throw new NotFoundError("User not found");

        return user;
    }
}