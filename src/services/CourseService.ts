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
import Content from "models/Content";
import Word from "models/Word";
import sequelize from "models";
import { Sequelize } from "sequelize-typescript";
import Category from "models/Category";
import UserCourse from "models/UserCourse";
import Test from "models/Test";


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
                    { model: Content },
                    {
                        model: Word
                    }, {model: Test}
                ]
            }],
            attributes: ['id', 'slug', 'isPublic', 'teacherId']
        })

        if (!course) throw new NotFoundError('Không tìm thấy khóa học')

        return {
            ...course.toJSON(),
            lessons: course.lessons.map(lesson => {
                return {
                    ...lesson.toJSON(),
                    words: lesson.words.length,
                }
            })
        };
    }

    //USER
    async getCoursesByCategory(categorySlug: string) {
        const category = await Category.findOne({
            where: { slug: categorySlug }
        })

        if (!category) throw new NotFoundError('Không tìm thấy danh mục')

        return await Course.findAll({
            where: {
                categoryId: category.id,
                isPublic: true,
            },
            include: [{
                model: User,
                as: 'teacher',
                attributes: ['id', 'name', 'email']
            }],
            order: [
                ['rating', 'DESC']
            ]
        })
    }

    async getCourse(slug: string, loggedInId: number | undefined) {
        const course = await Course.findOne({
            where: { slug },
            include: [{
                model: Lesson,
                attributes: ['id', 'name', 'slug'],
                include: [{
                    model: Content,
                    attributes: ['id', 'name', 'type'],
                }, {
                    model: Word,
                    attributes: ['id', 'vocab']
                }, {
                    model: Test,
                    attributes: ['id', 'timeLimit']
                }]
            }, {
                model: User,
                as: 'teacher',
            }]
        })

        if (!course) throw new NotFoundError('Không tìm thấy khóa học')
        console.log(course.toJSON())
        const responseCourse = this.responseCourse(course);

        if (loggedInId) {
            const userCourse = await UserCourse.findOne({
                where: {courseId: course.id, userId: loggedInId}
            })

            if (userCourse) {
                responseCourse.isEnrolled = true;
            }
        }

        return responseCourse;
    }

    async enrollCourse(user: IUserCredential, courseId: number) {
        const course = await Course.findOne({
            where: { id: courseId }
        })

        if (!course) throw new NotFoundError('Không tìm thấy khóa học')

        const userCourse = await UserCourse.findOne({
            where: {
                userId: user.id,
                courseId
            }
        })
        //Check if user has enrolled course
        if (userCourse) return course

        if (course.isPublic) {
            await UserCourse.create({
                userId: user.id,
                courseId
            });
            return course;
        } else {
            throw new ForbiddenError('Khóa học này không công khai')
        }
    }

    private responseCourse(course: Course) {
        return {
            ...course.toJSON(),
            lessons: course.lessons.map(lesson => {
                return {
                    id: lesson.id,
                    name: lesson.name,
                    slug: lesson.slug,
                    contents: lesson.contents,
                    words: lesson.words.length,
                    tests: lesson.tests,
                }
            }),
            teacher: {
                id: course.teacher.id,
                name: course.teacher.name,
                email: course.teacher.email,
                avatarLink: course.teacher.avatarLink,
            }
        }
    }
}