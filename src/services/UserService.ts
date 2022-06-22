import UserRepository from "../repository/UserRepository";
import { Service } from "typedi";
import { NotFoundError } from "routing-controllers";
import User from "models/User";
import Course from "models/Course";
import Test from "models/Test";
import Lesson from "models/Lesson";
import PageRequest from "dto/PageDto";
import { Op } from "sequelize";
import Folder from "models/Folder";
import Word from "models/Word";
import UserTest from "models/UserTest";

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

    public async getWithCourses(userId: number) {
        const result = await User.findOne({
            where: {id: userId},
            attributes: {exclude: ['password', 'registerToken', 'locked', 'role', 'activated']},
            include: [{
                model: Course,
                as: 'courses',
                include: [{
                    model: User,
                    as: 'teacher',
                    attributes: ['name']
                }]
            }]
        })

        return result
    }

    public async getWithTests(userId: number) {
        // const result = await User.findOne({
        //     where: {id: userId},
        //     attributes: [],
        //     include: [{
        //         model: UserTest,
        //         include: [{
        //             model: Test,
        //         }]
        //         // include: [{
        //         //     model: Lesson,
        //         //     attributes: ['name'],
        //         //     include: [{
        //         //         model: Course,
        //         //         attributes: ['name']
        //         //     }]
        //         // }]
        //     }]
        // })

        const result = await UserTest.findAll({
            where: {userId},
            include: [{
                model: Test,
                include: [{
                    model: Lesson,
                    attributes: ['name'],
                    include: [{
                        model: Course,
                        attributes: ['name']
                    }]
                }]
            }]
        })

        // const result = await UserTest.findAll({
        //     where: {userId},
        //     include: [{
        //         model: Test,
        //         include: [{
        //             model: Lesson,
        //             attributes: ['name'],
        //             include: [{
        //                 model: Course,
        //                 attributes: ['name']
        //             }]
        //         }]
        //     }]
        // })

    
        return result
    }

    public async getWithFolders(userId: number, pageRequest: PageRequest) {
        const {folderName} = pageRequest;
        console.log(folderName)
        const folderNameCondition = folderName ? {name: {[Op.like]: `${folderName}%`}} : null;
        console.log(folderNameCondition)
        const result = await User.findOne({
            where: {id: userId},
            // attributes: [],
            include: [{
                model: Folder,
                // as: 'folders',
                where: folderNameCondition,
                include: [{
                    model: Word,
                    as: 'words',
                }]

            }],
            order: [['folders', 'createdAt', 'DESC']],
        })


        const folders = [...result.toJSON().folders];
        
        // count total words in folders and delete words
        folders.forEach(folder => {
            folder.wordCount = folder.words.length;
            delete folder.words;
        })

        return folders
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