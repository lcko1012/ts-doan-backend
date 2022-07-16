import { StatusCodes } from "http-status-codes";
import { HttpError, NotFoundError, UnauthorizedError, ForbiddenError, Param, CurrentUser, BadRequestError } from "routing-controllers";
import { Service } from "typedi";
import CourseRepository from "repository/CourseRepository";
import Course from "models/Course";
import { CourseUpdateBasicDto, CouseCreatingDto, ReportCourseDto } from "dto/CourseDto";
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
import UserTest from "models/UserTest";
import MailSender from "utils/MailSender";

@Service()
export default class CourseService {
    constructor(
        private courseRepository: CourseRepository,
        private mailSender: MailSender
    ) { }

    async getCourses(pageRequest: PageRequest) {
        const { page, size, courseName } = pageRequest;

        var courseNameCondition = courseName ? { name: { [Op.like]: `%${courseName.toLowerCase()}%` } } : {};

        const result = await this.courseRepository.getAllCourses(page, size, courseNameCondition);;
        const list = result.rows

        return {
            list,
            count: result.count
        }
    }

    async getCoursesByTeacher(teacherId: number, courseName: string) {
        var nameCondition = courseName ? { name: 
                                        sequelize.where(sequelize.fn('lower', sequelize.col('name')),
                                        'LIKE', '%' +  courseName.toLowerCase() + '%')} : {};
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

        if (!course) throw new NotFoundError('Khóa học không tồn tại')

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
                'subtitle', 'imageLink', 'slug', 'isPublic'
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
            imageLink: data.imageLink,
            isPublic: data.isPublic
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
                    }, { model: Test }
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
        const { page, size, name, email, joinedDate } = params
        var nameCondition = name ? { name: { [Op.like]: `${name}%` } } : {};
        var joinedCondition = joinedDate ? {
            createdAt: {
                [Op.gt]: moment(joinedDate, 'YYYY-MM-DD'),
                [Op.lt]: moment(joinedDate, 'YYYY-MM-DD').add(1, 'days').toDate()
            }
        } : {};
        var emailCondition = email ? { email: { [Op.like]: `${email}%` } } : {};

        const course = await Course.findOne({
            where: { id: courseId, teacherId: user.id }
        })

        if (!course) throw new NotFoundError("Khóa học không tồn tại")

        const result = await UserCourse.findAndCountAll({
            where: {
                [Op.and]: [
                    { courseId },
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
            offset: size * page
        })

        return {
            students: result.rows,
            count: result.count
        };
    }

    //USER
    async getCoursesByCategory(categorySlug: string, params: PageRequest) {
        const {page, size, courseName} = params;
        var nameCondition = courseName ? { name:
                                        sequelize.where(sequelize.fn('lower', sequelize.col('name')),
                                        'LIKE', '%' +  courseName.toLowerCase() + '%')} : {};
        const category = await Category.findOne({
            where: { slug: categorySlug }
        })
        if (!category) throw new NotFoundError('Không tìm thấy danh mục')

        const courses = await Course.findAndCountAll({
            where: {
                [Op.and]: [
                    {categoryId: category.id},
                    {isPublic: true},
                    nameCondition
                ]
            },
            limit: size,
            offset: page*size,
            include: [{
                model: User,
                as: 'teacher',
                attributes: ['id', 'name', 'email']
            }, {
                model: Category,
            }, {
                model: Lesson,
                attributes: ['id']
            }],
            order: [['rating', 'DESC']]
        })

        const customCourses = courses.rows.map(course => {
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
                category: course.category.toJSON(),
                lessonsCount: course.lessons.length,
            }
        })
        return {
            courses: customCourses,
            count: courses.count
        }
    }

    async searchByCourseName(params: PageRequest) {
        const {page, size, courseName, filterCategory} = params;
        var nameCondition = courseName ? { name:
                                        sequelize.where(sequelize.fn('lower', sequelize.col('Course.name')),
                                        'LIKE', '%' +  courseName.toLowerCase() + '%')} : {};
        var categoryCondition = filterCategory ? { id: {[Op.in]: filterCategory} } : {};       
        const courses = await Course.findAndCountAll({
            where: {
                [Op.and]: [
                    {isPublic: true},
                    nameCondition
                ]
            },
            limit: size,
            offset: page*size,
            include: [{
                model: User,
                as: 'teacher',
                attributes: ['id', 'name', 'email']
            }, {
                model: Category,
                where: categoryCondition
            }, {
                model: Lesson,
                attributes: ['id']
            }],
            order: [['rating', 'DESC']]
        })
        const customCourses = courses.rows.map(course => {
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
                lessonsCount: course.lessons.length,
            }
        })
        return {
            courses: customCourses,
            count: courses.count
        }
    }

    async getCourse(slug: string, user: IUserCredential) {
        const loggedInId = user?.id
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
                    attributes: ['id', 'name', 'timeLimit'],
                    include: [{
                        model: UserTest,
                        attributes: ['isPass', 'userId']
                    }]
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
                where: { courseId: course.id, userId: loggedInId }
            })

            if (userCourse) {
                responseCourse.isEnrolled = true;
            }
            responseCourse.lessons?.map((lesson, item) => {
                if (item === 0) {
                    lesson.isOpen = true;
                }
                if (lesson?.tests.length === 0 && item < responseCourse.lessons.length - 1) {
                    lesson.isOpen = true
                    responseCourse.lessons[item + 1].isOpen = true
                }
                else {
                    lesson?.tests?.map(test => {
                        test?.userTests?.map((userTest) => {
                            if (userTest.isPass === true && userTest.userId === user.id &&
                                item < responseCourse.lessons.length - 1) 
                            {
                                lesson.isOpen = true
                                responseCourse.lessons[item + 1].isOpen = true
                                return
                            }
                        })

                    })
                }
            })
        }

        return responseCourse;
    }

    async enrollCourse(user: IUserCredential, courseId: number) {
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

    async getByAdmin(pageRequest: PageRequest) {
        const { page, size, courseName, categoryId } = pageRequest
        var nameCondition = courseName ? { name:
            sequelize.where(sequelize.fn('lower', sequelize.col('Course.name')),
            'LIKE', '%' +  courseName.toLowerCase() + '%')} : {};
        var categoryIdCondition = categoryId ? { id: categoryId } : {}

        const result = await Course.findAndCountAll({
            where: {
                [Op.and]: [
                    { isPublic: true },
                    nameCondition
                ]
            },
            include: [{
                model: Category,
                attributes: ['name', 'id'],
                where: categoryIdCondition
            }, {
                model: User,
                as: 'teacher',
                attributes: ['name', 'id']
            }],
            limit: size,
            offset: page * size
        })
        return {
            courses: result.rows,
            count: result.count
        }
    }

    async sendMailReportCourseByAdmin(data: ReportCourseDto) {
        const course = await Course.findOne({
            where: {id: data.courseId},
            include: [{
                model: User,
                as: 'teacher',
            }]
        })
        if (!course) throw new NotFoundError("Không tìm thấy khóa học")
        this.mailSender.sendMailReportCourseByAdmin(course.teacher.email, course.name, data.content);
    }

    async deleteCourseByAdmin(courseId: number) {
        const course = await Course.findOne({
            where: {id: courseId},
            include: [{
                model: User,
                as: 'teacher',
            }]
        })
        if (!course) throw new NotFoundError("Không tìm thấy khóa học")
        await Course.destroy({
            where: {id: courseId}
        })
        const content = 'Khóa học "' + course.name + '" đã bị xóa bởi quản trị viên'
        this.mailSender.sendMailReportCourseByAdmin(course.teacher.email, course.name, content);
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
                nameLink: course.teacher.nameLink
            }
        }
    }
}