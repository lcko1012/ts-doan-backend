import { CourseUpdateBasicDto, CouseCreatingDto } from "dto/CourseDto";
import PageRequest from "dto/PageDto";
import { Response } from "express";
import { StatusCodes } from "http-status-codes";
import IUserCredential from "interfaces/IUserCredential";
import { Authorized, Body, CurrentUser, Delete, Get, HttpCode, JsonController, Param, Patch, Post, Put, QueryParam, QueryParams, Res } from "routing-controllers";
import CourseService from "services/CourseService";
import { Service } from "typedi";

@JsonController('/course')
@Service()
export default class CourseController {
    constructor(
        readonly courseService: CourseService,
    ){}

    @Get('/teacher')
    @Authorized('ROLE_TEACHER')
    async getCoursesByTeacher(
        @QueryParams() pageRequest: PageRequest, 
        @CurrentUser() user: IUserCredential,
        @Res() res: Response) 
    {   
        const {id} = user;
        const courses = await this.courseService.getCoursesByTeacher(id);
        return res.send(courses);
    }

    @Post('/teacher')
    @Authorized('ROLE_TEACHER')
    async createCourseByTeacher(
        @CurrentUser() user: IUserCredential,
        @Body() course: CouseCreatingDto,
        @Res() res: Response) 
    {
        const {id} = user;
        await this.courseService.createCourseByTeacher(id, course);
        return res.status(StatusCodes.CREATED).send({
            message: "Tạo khóa học thành công"
        });
    }

    @Get('/:slug/edit/teacher')
    @Authorized('ROLE_TEACHER')
    async getDetailsToEditByTeacher(
        @CurrentUser() user: IUserCredential,
        @Param('slug') slug: string,
        @Res() res: Response)
    {
        const course = await this.courseService.getDetailsToEditByTeacher(user, slug);
        return res.send(course);
    }

    @Get('/:slug/basic/teacher')
    @Authorized('ROLE_TEACHER')
    async getBasicByTeacher(
        @CurrentUser() user: IUserCredential,
        @Param('slug') slug: string,
        @Res() res: Response) 
    {
        const course = await this.courseService.getBasicByTeacher(user, slug);
        return res.send(course);
    }

    @Put('/:id/basic/teacher')
    @Authorized('ROLE_TEACHER')
    async updateBasicByTeacher(
        @CurrentUser() user: IUserCredential,
        @Param('id') id: number,
        @Body() data: CourseUpdateBasicDto,
        @Res() res: Response) 
    {
        await this.courseService.updateBasicByTeacher(user, id, data);
        return res.send({
            message: 'Cập nhật thành công'
        });
    }

}