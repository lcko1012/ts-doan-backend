import { StatusCodes } from "http-status-codes";
import { HttpError, NotFoundError, UnauthorizedError, ForbiddenError, Param, CurrentUser, BadRequestError } from "routing-controllers";
import { Service } from "typedi";
import CourseRepository from "repository/CourseRepository";
import Course from "models/Course";
import { CourseUpdateBasicDto, CouseCreatingDto } from "dto/CourseDto";
import StringUtils from "utils/StringUtils";
import PageRequest, { UserListInCourse } from "dto/PageDto";
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
import moment from "moment";


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

    async getCoursesByTeacher(teacherId: number, courseName: string) {
        var nameCondition = courseName ? { name: { [Op.like]: `${courseName}%` } } : {};
        return await this.courseRepository.getCoursesByTeacher(teacherId, nameCondition);
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

    async deleteByTeacher(user: IUserCredential, id: number) {
        const course = await Course.findOne({
            where: {
                teacherId: user.id,
                id
            }
        })

        if(!course) throw new NotFoundError('Khóa học không tồn tại')

        await course.destroy();
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
            attributes: ['id', 'slug', 'isPublic', 'teacherId'],
            order: [
                ['id', 'ASC'],
                ['lessons', 'id', 'ASC'],
                ['lessons', 'contents', 'id', 'ASC'],
                ['lessons', 'tests', 'id', 'ASC']
            ]
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

    async getStudents(user: IUserCredential, courseId: number, params: UserListInCourse) {
        const {page, size, name, email, joinedDate} = params
        var nameCondition = name ? { name: { [Op.like]: `${name}%` } } : {};
        var joinedCondition = joinedDate ? { 
            createdAt: {[Op.gt]: moment(joinedDate, 'YYYY-MM-DD'), 
                        [Op.lt]: moment(joinedDate, 'YYYY-MM-DD').add(1, 'days').toDate() 
                    }} : {};
        var emailCondition =  email ? { email: { [Op.like]: `${email}%` } } : {};
        
        const course = await Course.findOne({
            where: {id: courseId, teacherId: user.id}
        })

        if (!course) throw new NotFoundError("Khóa học không tồn tại")

        const result = await UserCourse.findAndCountAll({
            where: {
                [Op.and]: [
                    {courseId},
                    joinedCondition
                ]
            },
            include: [{
                model: User,
                where: {
                    [Op.and]: [
                        nameCondition,
                        emailCondition
                    ]
                },
                attributes: {
                    exclude: ['locked', 'activated', 'registerToken', 'password']
                }
            }],
            limit: size,
            offset: size*page 
        })

        return {
            students: result.rows,
            count: result.count
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
                    attributes: ['id', 'name', 'timeLimit']
                }],
            }, {
                model: User,
                as: 'teacher',
            }],
            order: [
                ['lessons', 'createdAt', 'ASC'],
                ['lessons', 'tests', 'id', 'ASC'],
                ["lessons", "contents", 'id', 'ASC'],

            ]
        })

        if (!course) throw new NotFoundError('Không tìm thấy khóa học')
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
        console.log(user)
        const course = await Course.findOne({
            where: { id: courseId, }
        })

        if (!course) throw new NotFoundError('Không tìm thấy khóa học')

        const userCourse = await this.checkUserEnrolledCourse(user.id, courseId);
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

    async checkUserEnrolledCourse(userId: number, courseId: number) {
        const userCourse = await UserCourse.findOne({
            where: {
                userId: userId,
                courseId
            }
        })

        return userCourse
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