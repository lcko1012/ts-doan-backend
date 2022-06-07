import { StatusCodes } from "http-status-codes";
import { HttpError, NotFoundError, UnauthorizedError, ForbiddenError } from "routing-controllers";
import { Service } from "typedi";
import CourseRepository from "repository/CourseRepository";
import Course from "models/Course";
import { CourseUpdateBasicDto, CouseCreatingDto } from "dto/CourseDto";
import StringUtils from "utils/StringUtils";
import PageRequest from "dto/PageDto";
import { Op } from "sequelize";
import IUserCredential from "interfaces/IUserCredential";
import User from "models/User";
import Lesson from "models/Lesson";
import Video from "models/Video";
import Article from "models/Article";
import Word from "models/Word";
import sequelize from "models";
import { Sequelize } from "sequelize-typescript";


@Service()
export default class CourseService {
    constructor(
        private courseRepository: CourseRepository,
    ) { }

    async getCourses(pageRequest: PageRequest) {
        const { page, size, courseName } = pageRequest;

        var courseNameCondition = courseName ? { name: { [Op.like]: `%${courseName}%` } } : {};

        const result = await this.courseRepository.getAllCourses(page, size, courseNameCondition);;
        const list = result.rows

        return {
            list,
            count: result.count
        }
    }
    async getCoursesByTeacher(teacherId: number) {
        return await this.courseRepository.getCoursesByTeacher(teacherId);
    }

    async createCourseByTeacher(teacherId: number, course: CouseCreatingDto) {
        var slug = StringUtils.createSlug(course.name);

        var existedCourse = await Course.findOne({
            where: { slug }
        })

        while (existedCourse) {
            slug = slug + '-' + StringUtils.randomInt(1, 100);
            existedCourse = await Course.findOne({
                where: { slug }
            })
        }

        return await Course.create({
            name: course.name,
            categoryId: course.categoryId,
            slug,
            teacherId,
            imageLink: 'https://dldwormxm4m6s.cloudfront.net/lecanhkieuoanh/1654147086444-Video files-bro.png'
        })
    }

    async getDetailsToEditByTeacher(user: IUserCredential, slug: string) {
        const course = await Course.findOne({
            where: { slug, teacherId: user.id }
        })

        if (!course) throw new NotFoundError('Không tìm thấy khóa học')

        return course;
    }

    async getBasicByTeacher(user: IUserCredential, id: number) {
        const course = await Course.findOne({
            where: { id, teacherId: user.id },
            attributes: [
                'id', 'name', 'description',
                'subtitle', 'imageLink', 'slug',
            ]
        })

        if (!course) throw new NotFoundError('Không tìm thấy khóa học')

        return course
    }

    async updateBasicByTeacher(user: IUserCredential, id: number, data: CourseUpdateBasicDto) {
        const course = await Course.findOne({
            where: { id, teacherId: user.id }
        })

        if (!course) throw new NotFoundError('Không tìm thấy khóa học')

        await Course.update({
            name: data.name,
            description: data.description,
            subtitle: data.subtitle,
            imageLink: data.imageLink
        }, { where: { id } })
    }

    async getLessonOfCourse(user: IUserCredential, courseId: number) {
        const course = await Course.findOne({
            where: { id: courseId, teacherId: user.id },
            include: [{
                model: Lesson,
                include: [
                    { model: Video },
                    { model: Article },
                    {
                        model: Word
                    }
                ]
            }],
            attributes: ['id', 'slug', 'isPublic', 'teacherId']
        })

        if (!course) throw new NotFoundError('Không tìm thấy khóa học')

        return course;
    }
}