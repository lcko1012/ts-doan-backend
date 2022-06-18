import { ContentCreateingDto } from "dto/ContentDto";
import IUserCredential from "interfaces/IUserCredential";
import Content from "models/Content";
import Course from "models/Course";
import Lesson from "models/Lesson";
import UserCourse from "models/UserCourse";
import { BadRequestError, NotFoundError } from "routing-controllers";
import { Service } from "typedi";

@Service()
export default class ContentService {
    constructor() { }

    async create(body: ContentCreateingDto, user: IUserCredential) {
        const lesson = await Lesson.findOne({
            where: { id: body.lessonId },
            include: [{
                model: Course,
                where: { teacherId: user.id }
            }]
        })

        if (!lesson) throw new NotFoundError('Bài học không tồn tại');

        if (body.type === 'CONTENT_VIDEO' && body.path) {
            await Content.create({
                name: body.name,
                path: body.path,
                lessonId: body.lessonId,
                type: body.type,
            })
        }
        else if (body.type === 'CONTENT_ARTICLE' && body.content) {
            await Content.create({
                name: body.name,
                content: body.content,
                lessonId: body.lessonId,
                type: body.type,
            })
        }
        else throw new BadRequestError('Bạn điền thiếu tham số')
    }

    async update(id: number, body: ContentCreateingDto, user: IUserCredential) {
        const content = await Content.findOne({
            where: { id, lessonId: body.lessonId },
            include: [{
                model: Lesson,
                include: [{
                    model: Course,
                    where: { teacherId: user.id }
                }]
            }]
        })

        if (!content) throw new NotFoundError('Bài học không tồn tại');

        if (body.type === 'CONTENT_VIDEO' && body.path) {
            await content.update({
                name: body.name,
                path: body.path,
            })
        }
        else if (body.type === 'CONTENT_ARTICLE' && body.content) {
            await content.update({
                name: body.name,
                content: body.content,
            })
        }
    }

    async getByTeacher(id: number, user: IUserCredential) {
        const content = await this.findContentByIdAndTeacherId(id, user.id)
        return {
            id: content.id,
            name: content.name,
            type: content.type,
            path: content.path,
            content: content.content,
            lessonId: content.lessonId,
        }
    }

    async delete(id: number, user: IUserCredential) {
        const content = await this.findContentByIdAndTeacherId(id, user.id)
        await content.destroy()
    }

    async getByStudent(id: number, user: IUserCredential) { 
        //1. check if user in course
        const content = await Content.findOne({
            where: {id},
            include: [{
                model: Lesson,    
            }]
        })

        if (!content) throw new NotFoundError('Bài học không tồn tại');

        await this.checkIfStudentInCourse(user.id, content.lesson.courseId)

        return {
            id: content.id,
            name: content.name,
            type: content.type,
            path: content.path,
            content: content.content,
            lessonId: content.lessonId,
        }
    }

    private async checkIfStudentInCourse(userId: number, courseId: number) {
        const enrolled = await UserCourse.findOne({
            where: {
                userId,
                courseId
            }
        })

        if (!enrolled) throw new BadRequestError('Bạn chưa đăng ký khóa học này')

        return enrolled;
    }

    private async findContentByIdAndTeacherId(id: number, teacherId: number) {
        const content = await Content.findOne({
            where: { id },
            include: [{
                model: Lesson,
                include: [{
                    model: Course,
                    where: { teacherId}
                }]
            }]
        })

        if (!content) throw new NotFoundError('Bài học không tồn tại');
        return content;
    }
}