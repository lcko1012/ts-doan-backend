import { CouseCreatingDto } from "dto/CourseDto";
import { DefinitionUpdatingDto } from "dto/DefinitionDto";
import { Response } from "express";
import { StatusCodes } from "http-status-codes";
import { BadRequestError, Body, BodyParam, Delete, Get, HttpCode, JsonController, Param, Patch, Post, Put, Res } from "routing-controllers";
import CourseService from "services/CourseService";
// import TopicService from "services/TopicService";
import { Service } from "typedi";

@JsonController('/topic')
@Service()
export default class TopicController {
    // constructor(
    //     // readonly courseService: CourseService,
    //     readonly topicService: TopicService,
    // ){}

    // //Get all topics
    // @Get()
    // @HttpCode(StatusCodes.OK)
    // async getTopics(@Res() res: Response) {
    //     const topics = await this.topicService.getTopics();
    //     return res.send(topics);
    // }
    

    // //Get all course in topic
    // @Get('/:id')
    // @HttpCode(StatusCodes.OK)
    // async getCoursesByTopic(@Param('topic_id') topicId: number, @Res() res: Response) {
    //     // const courses = await this.courseService.getCoursesByTopic(topicId);
    //     // return res.send(courses);
    // }

    // @Post()
    // @HttpCode(StatusCodes.OK)
    // async createTopic(@BodyParam('name') name:string, @Res() res: Response) {
    //     if (!name) throw new BadRequestError('Tên thể loại không được để trống');
    //     const topic = await this.topicService.createTopic(name);
    //     return res.send({
    //         message: 'Thêm thể loại thành công',
    //         topic
    //     });
    // }

    // //Get courses by topic name
    // @Get('/:name/courses')
    // @HttpCode(StatusCodes.OK)
    // async getTopicWithCoursesByName(@Param('name') name: string, @Res() res: Response) {
    //     if (!name) throw new BadRequestError('Tên thể loại không được để trống');
    //     const topicWithCourses = await this.topicService.getTopicWithCoursesByName(name);
    //     return res.send(topicWithCourses);
    // }
}