import { FeedbackDto } from "dto/FeedbackDto";
import IUserCredential from "interfaces/IUserCredential";
import Course from "models/Course";
import Feedback from "models/Feedback";
import User from "models/User";
import UserCourse from "models/UserCourse";
import { BadRequestError } from "routing-controllers";
import { Service } from "typedi";

@Service()
export default class FeedbackService {
    constructor() {}

    async checkExist(courseId: number, user: IUserCredential) {
        const feedback = await Feedback.findOne({
            where: {courseId, userId: user.id}
        })
        if (!feedback) return false
        return true
    }

    async create(body: FeedbackDto, user: IUserCredential) {
        const course = await UserCourse.findOne({
            where: {courseId: body.courseId, userId: user.id}
        })
        if (!course) throw new BadRequestError("Bạn chưa tham gia khóa học")

        const feedback = await Feedback.findOne({
            where: {courseId: body.courseId, userId: user.id}
        })

        if (feedback) throw new BadRequestError("Bạn đã đánh giá khóa học này")
        


        const fb = await Feedback.create({
            content: body.content,
            rating: body.rating,
            courseId: body.courseId,
            userId: user.id
        })

        if (fb) {
            // update rating of course
            const course = await Course.findOne({
                where: {id: body.courseId}
            })
            if (course) {
                const rating = await Feedback.findAll({
                    where: {courseId: body.courseId}
                })
                if (rating) {
                    const sum = rating.reduce((acc, cur) => acc + cur.rating, 0)
                    const avg = sum / rating.length
                    await course.update({rating: avg})
                }
            }
        }
    }

    async getFeedbacks(courseId: number, user: IUserCredential) {
        const feedbacks = await Feedback.findAll({
            where: {courseId},
            include: [{
                model: User,
                attributes: ['id', 'name', 'avatarLink']
            }]
        })


        const customFeedbacks = feedbacks.map(feedback => {
            return {
                ...feedback.toJSON(),
                mine: feedback.userId === user.id
            }

        })
        
        return customFeedbacks
    }
}