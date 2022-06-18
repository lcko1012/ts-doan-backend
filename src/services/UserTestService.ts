import IUserCredential from "interfaces/IUserCredential";
import Answer from "models/Answer";
import Question from "models/Question";
import Test from "models/Test";
import UserTest from "models/UserTest";
import { NotFoundError } from "routing-controllers";
import { Service } from "typedi";

@Service()
export default class UserTestService {
    constructor() { }

    async getDetailsByStudent(userTestId: number, student: IUserCredential) {
        const userTest = await UserTest.findOne({
            where: { id: userTestId, userId: student.id },
        })

        if (!userTest) throw new NotFoundError('Không tìm thấy đề thi')

        userTest.details = JSON.parse(userTest.details);

        const test = await Test.findOne({
            where: {id: userTest.testId},
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
}