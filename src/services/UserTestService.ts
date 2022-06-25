import { UserTestRequestDto } from "dto/PageDto";
import IUserCredential from "interfaces/IUserCredential";
import Answer from "models/Answer";
import Question from "models/Question";
import Test from "models/Test";
import User from "models/User";
import UserTest from "models/UserTest";
import { NotFoundError } from "routing-controllers";
import { Op } from "sequelize";
import { Service } from "typedi";
import LessonService from "./LessonService";
import moment from 'moment'

@Service()
export default class UserTestService {
    constructor(
        readonly lessonService: LessonService

    ) { }

    async getDetailsByStudent(userTestId: number, student: IUserCredential) {
        const userTest = await UserTest.findOne({
            where: { id: userTestId, userId: student.id },
        })

        if (!userTest) throw new NotFoundError('Không tìm thấy đề thi')

        userTest.details = JSON.parse(userTest.details);

        const test = await Test.findOne({
            where: { id: userTest.testId },
        })

        if (!test) throw new NotFoundError('Không tìm thấy đề thi')

        return {
            ...userTest.toJSON(),
            test: {
                ...test.toJSON()
            }
        }
    }

    async getListByStudent(student: IUserCredential) {
        const userTests = await UserTest.findAll({
            where: { userId: student.id },
        })
        return userTests
    }

    async getListByTeacher(id: number, lessonId: number,
        teacher: IUserCredential, userTestRequest: UserTestRequestDto
    ) {
        const { page, size, name, createdAt, isPass, scoreOrder } = userTestRequest;
        var nameCondition = name ? { name: { [Op.like]: `${name}%` } } : {};
        var createdAtCondition = createdAt ? { 
            createdAt: {[Op.gt]: moment(createdAt, 'YYYY-MM-DD'), 
                        [Op.lt]: moment(createdAt, 'YYYY-MM-DD').add(1, 'days').toDate() 
                    }} : {};
        var isPassCondition = isPass ? { isPass: { [Op.eq]: `${isPass}` } } : {};
        
        await this.lessonService.findLessonByIdAndTeacherId(lessonId, teacher.id);
        const userTest = await UserTest.findAndCountAll({
            where: {
                [Op.and]: [
                    { testId: id },
                    isPassCondition,
                    createdAtCondition
                ],
                
            },
            limit: size,
            offset: size*page,
            include: [{
                model: User,
                attributes: {
                    exclude: ['password', 'createdAt', 'updatedAt', 'locked', 'activated']
                },
                where: {
                    [Op.and]: [
                        nameCondition
                    ]
                }
            }],
            order: scoreOrder ? [['score', scoreOrder]] : []
        })

        return {
            tests: userTest.rows,
            count: userTest.count
        };
    }

    async getDetailsByTeacher(userTestId: number, teacher: IUserCredential) {
        const userTest = await UserTest.findOne({
            where: { id: userTestId },
            include: [{
                model: User
            }, {
                model: Test,
            }]
        })

        if (!userTest) throw new NotFoundError('Không tìm thấy đề thi')

        await this.lessonService.findLessonByIdAndTeacherId(userTest.test.lessonId, teacher.id);

        return {
            ...userTest.toJSON(),
            details: JSON.parse(userTest.details)
        }
    }

}