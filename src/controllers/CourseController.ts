import { CouseCreatingDto } from "dto/CourseDto";
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
        const {email} = user;
        const courses = await this.courseService.getCoursesByTeacher(email);
        res.send(courses);
    }

    // @Get('/admin')
    // async getCourses(@QueryParams() pageRequest: PageRequest, @Res() res: Response) {
    //     const {list, count} = await this.courseService.getCourses(pageRequest);
    //     return res.send({courses: list, count});
    // }

    // @Get('/topic/:topic_id')
    // @HttpCode(StatusCodes.OK)
    // async getCoursesByTopic(@Param('topic_id') topicId: number, @Res() res: Response) {
    //     const courses = await this.courseService.getCoursesByTopic(topicId);
    //     return res.send(courses);
    // }

    // @Get('/:slug')
    // @HttpCode(StatusCodes.OK)
    // async getCourse(@Param('slug') slug: string, @Res() res: Response) {
    //     const course = await this.courseService.getCourseBySlug(slug);
    //     return res.send(course);
    // }

    // @Post()
    // @HttpCode(StatusCodes.CREATED)
    // async createCourse(@Body() course: CouseCreatingDto, @Res() res: Response) {
    //     const newCourse = await this.courseService.createCourse(course);
    //     return res.send(newCourse);
    // }
}