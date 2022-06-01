import { StatusCodes } from "http-status-codes";
import { BadRequestError, HttpError, NotFoundError, UnauthorizedError } from "routing-controllers";
import { Service } from "typedi";
import CourseRepository from "repository/CourseRepository";
import Course from "models/Course";
import { CouseCreatingDto } from "dto/CourseDto";
import StringUtils from "utils/StringUtils";
import PageRequest from "dto/PageDto";
import { Op } from "sequelize";
import Category from "models/Category";


@Service()
export default class CategoryService {
    constructor(
        // private courseRepository: CourseRepository,
    ){}

    async getCategories() {
        return await Category.findAll()
    }
   
    async createCategory(name: string) {
        const category = await Category.findOne({
            where: {name}
        })
        if (category) throw new BadRequestError('Thể loại đã tồn tại')

        return await Category.create({
            name
        })
    }
}