import IUserCredential from "interfaces/IUserCredential";
import Course from "models/Course";
import User from "models/User";
import UserCourse from "models/UserCourse";
import { BadRequestError, NotFoundError } from "routing-controllers";
import { Op } from "sequelize";
import { Service } from "typedi";

@Service()
export default class UserCourseSerivice {
    constructor(){}
    
    async findUserByEmailByTeacher(email: string, courseId: number) {
        const students = await UserCourse.findAll({
            where: {
                courseId,
            },
            include: [{
                model: User,
            }]
        })

        const studentsId = students.map(student => student.userId)

        //not in course
        const users = await User.findAll({
            where: {
                id: {[Op.notIn]: studentsId},
                email: {
                    [Op.like]: `${email.toLowerCase().trim()}%`
                }
            }
        })

        return users;
    }

    async addUserToCouseByTeacher(userId: number, courseId: number, teacher: IUserCredential) {
        const course = await Course.findOne({
            where: {id: courseId, teacherId: teacher.id}
        })

        if (!course) throw new NotFoundError('Khóa học không tồn tại')

        const existedStudent = await UserCourse.findOne({
            where: {userId, courseId}
        })

        if (existedStudent) throw new BadRequestError('Học viên đã tham gia khóa học')

        await UserCourse.create({
            courseId,
            userId
        })
    }
}