import UserRepository from "../repository/UserRepository";
import { Service } from "typedi";
import { BadRequestError, NotFoundError } from "routing-controllers";
import User from "models/User";
import Course from "models/Course";
import Test from "models/Test";
import Lesson from "models/Lesson";
import PageRequest, { UserListParams } from "dto/PageDto";
import { Op } from "sequelize";
import Folder from "models/Folder";
import Word from "models/Word";
import UserTest from "models/UserTest";
import IUserCredential from "interfaces/IUserCredential";
import UserUpdate from "dto/UserDto";
import bcrypt from "bcrypt";
import sequelize from "models";


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

    public async getWithTests(userId: number, params: PageRequest) {
        const {page, size, courseId} = params;
        console.log(courseId)
        const courseCondition = courseId ? {
            'lesson.courseId' : courseId} : null;

        const result = await UserTest.findAndCountAll({
            where: {userId: userId},
            include: [{
                model: Test,
                where: courseCondition,
                include: [{
                    model: Lesson,
                    attributes: ['name', 'id', 'courseId'],
                    include: [{
                        model: Course,
                        attributes: ['name', 'id'],
                    }]
                }]
            }],
            offset: page * size,
            limit: size,
        })
        return {
            tests: result.rows,
            count: result.count,
        }
    }

    public async getWithFolders(userId: number, pageRequest: PageRequest) {
        const {folderName} = pageRequest;
        console.log(folderName)
        const folderNameCondition = folderName ? {name: 
                                    sequelize.where(sequelize.fn('LOWER', sequelize.col('folders.name')), 
                                                    'LIKE', '%' + folderName.toLowerCase() + '%')} : null;
        const result = await User.findOne({
            where: {id: userId},
            include: [{
                model: Folder,
                where: folderNameCondition,
                include: [{
                    model: Word,
                    as: 'words',
                }]

            }],
            order: [['folders', 'createdAt', 'DESC']],
        })

        if (!result) throw new NotFoundError("User not found");
        const folders = [...result.toJSON().folders];
        
        // count total words in folders and delete words
        folders.forEach(folder => {
            folder.wordCount = folder.words.length;
            delete folder.words;
        })

        return folders
    }

    async getUserById(id: number) {
        const user = await User.findOne({
            where: {activated: true, id},
            attributes: ['name', 'email', 'avatarLink', 'role']
        })
        return user;
    }

    async update(currentUser: IUserCredential, data: UserUpdate){
        if (data.nameLink) {
            const user = await User.findOne({
                where: {nameLink: data.nameLink, id: {[Op.ne]: currentUser.id}}
            })

            if (user) throw new BadRequestError('Tên đã tồn tại')
        }

        const user = await User.findOne({
            where: {id: currentUser.id}
        })

        if ((data.password_confirmation || data.password)) {
            if (data.password_confirmation === data.password) {
                data.password =  await bcrypt.hash(data.password, 10);
            }else {
                throw new BadRequestError('Thiếu thông tin mật khẩu')
            }
        }

        await user.update(data)
    }

    async getTeacherInfo(nameLink: string) {
        const user = await User.findOne({
            where: {nameLink, role: 'ROLE_TEACHER'},
            attributes: ['name', 'avatarLink', 'about', ],
            include: [{
                model: Course,
                as: 'ownedCourses',
                include: [{
                    model: User,
                    as: 'teacher',
                    attributes: ['id', 'name', 'email']
                }, {
                    model: Lesson,
                    attributes: ['id']
                }]
            }]
        })
        return {
            ...user.toJSON(),
            ownedCourses: user.ownedCourses.map(course => {
                return {
                    id: course.id,
                    name: course.name,
                    slug: course.slug,
                    imageLink: course.imageLink,
                    createdAt: course.createdAt,
                    subtitle: course.subtitle,
                    teacherId: course.teacherId,
                    isPublic: course.isPublic,
                    description: course.description,
                    rating: course.rating,                
                    teacher: course.teacher.toJSON(),
                    lessonsCount: course.lessons.length
                }
            })
        };
    }

    async getUsersByAdmin(params: UserListParams) {
        const {page, size, name, role, locked, email} = params;
        const nameCondition = name ? {name: 
                                    sequelize.where(sequelize.fn('LOWER', sequelize.col('name')), 
                                                    'LIKE', '%' + name.toLowerCase() + '%')} : null;
        const roleCondition = role ? {role: role} : null;
        const emailCondition = email ? {email:
                                    sequelize.where(sequelize.fn('LOWER', sequelize.col('email')),
                                                    'LIKE', '%' + email.toLowerCase() + '%')} : null;
        const lockedCondition = locked ? {locked: locked} : null;
        
        const result = await User.findAndCountAll({
            where: {...nameCondition, ...roleCondition, ...emailCondition, ...lockedCondition},
            offset: page * size,
            limit: size,
            attributes: {
                exclude: ['password', 'registerToken']
            }
        })
        return {
            users: result.rows,
            total: result.count,
        }
    }

    async lockAccount (userId: number) { 
        const user = await User.findOne({
            where: {id: userId}
        })
        if (!user) throw new NotFoundError("Không tìm thấy tài khoản");
        await user.update({locked: !user.locked})
        if (user.locked) return "Tài khoản đã bị khóa"
        return "Tài khoản đã mở khóa"
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
            about: user.about,
            nameLink: user.nameLink,
        };
    }
}