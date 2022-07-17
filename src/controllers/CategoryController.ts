import { CategoryCreatingDto } from "../dto/CategoryDto";
import { CouseCreatingDto } from "../dto/CourseDto";
import PageRequest from "../dto/PageDto";
import { Response } from "express";
import { StatusCodes } from "http-status-codes";
import IUserCredential from "../interfaces/IUserCredential";
import { Authorized, Body, CurrentUser, Delete, Get, HttpCode, JsonController, Param, Patch, Post, Put, QueryParam, QueryParams, Res } from "routing-controllers";
import CategoryService from "../services/CategoryService";
import { Service } from "typedi";

@JsonController('/category')
@Service()
export default class CategoryController {
    constructor(
        readonly categoryService: CategoryService,
    ) { }

    @Get()
    async getCategories(@Res() res: Response) {
       const categories = await this.categoryService.getCategories()
       return res.send(categories);
    }

    @Post()
    async createCategory(@Res() res: Response, @Body() category: CategoryCreatingDto) {
        await this.categoryService.createCategory(category.name);
        return res.status(StatusCodes.CREATED).send({
            message: "Tạo mới thành công"
        });
    }

}