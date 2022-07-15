import { Authorized, BadRequestError, Body, BodyParam, CurrentUser, Get, JsonController, Param, Post, Res } from "routing-controllers";
import { Service } from "typedi";
import { Response } from 'express'
import IUserCredential from "interfaces/IUserCredential";
import { FeedbackDto } from "dto/FeedbackDto";
import FeedbackService from "services/FeedbackService";

@JsonController('/feedback')
@Service()
export default class FeedbackController {
    constructor(
        readonly feedbackService: FeedbackService
    ) {}

    @Post()
    @Authorized()
    async create(
        @Body() body: FeedbackDto,
        @CurrentUser() user: IUserCredential,
    ) {
        body.content = body.content.trim();
        await this.feedbackService.create(body, user);
        return {
            message: 'Đánh giá thành công'
        }
    }

    @Post('/check-exist')
    @Authorized()
    async checkExist(
        @BodyParam('courseId') courseId: number,
        @CurrentUser() user: IUserCredential,
    ) {
        if (!courseId) throw new BadRequestError('Không tìm thấy khóa học');
        const result = await this.feedbackService.checkExist(courseId, user);
        return {
            result
        }
    }

    @Get('/course/:courseId')
    async getFeedbacks(
        @CurrentUser() user: IUserCredential,
        @Param('courseId') courseId: number,
        @Res() res: Response,
    ) {
        const feedbacks = await this.feedbackService.getFeedbacks(courseId, user);
        return res.send(feedbacks)
    }
}