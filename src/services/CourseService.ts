import { StatusCodes } from "http-status-codes";
import { HttpError, NotFoundError, UnauthorizedError } from "routing-controllers";
import { Service } from "typedi";
import CourseRepository from "repository/CourseRepository";
import Course from "models/Course";
import { CouseCreatingDto } from "dto/CourseDto";
import StringUtils from "utils/StringUtils";
import PageRequest from "dto/PageDto";
import { Op } from "sequelize";


@Service()
export default class CourseService {
    constructor(
        private courseRepository: CourseRepository,
    ){}

    async getCourses(pageRequest: PageRequest) {
        const {page, size, courseName} = pageRequest;

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
        return await Course.create({
            name: course.name,
            categoryId: course.categoryId,
            teacherId
        })
    }
}