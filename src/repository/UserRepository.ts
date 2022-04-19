import User from "models/User";
import { Service } from "typedi";

@Service()
export default class UserRepository {
    public async findByEmail(email: string): Promise<User | null> {
        return await User.findOne({
            where: {email: email}
        })
    }

    public async findByEmailAndActivated(email: string): Promise<User | null> { 
        return await User.findOne({
            raw: true,
            where: {email: email, activated: true}
        })
    }

    public async findByRegisterToken(token: string): Promise<User | null> {
        return await User.findOne({
            where: {
                registerToken: token,
                activated: false
            }
        })
    }
}