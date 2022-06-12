import QuestionUpdateDto, {QuestionCreateDto} from "dto/QuestionDto";
import IUserCredential from "interfaces/IUserCredential";
import sequelize from "models";
import Answer from "models/Answer";
import Course from "models/Course";
import Lesson from "models/Lesson";
import Question from "models/Question";
import Test from "models/Test";
import User from "models/User";
import { BadRequestError, NotFoundError } from "routing-controllers";
import { Service } from "typedi";

@Service()
export default class QuestionService { 
    constructor(){}

    async getListByTeacher(lessonId: number, 
        testId: number, teacher: IUserCredential) {
       
        await this.findTestByLessonIdAndTeacherId(lessonId, testId, teacher.id)
        
        const questions = await Question.findAll({
            where: {testId},
            include: [{
                model: Answer,
                order: [[ 'id', 'ASC']]
            }],
            subQuery: true,
        })

        console.log(questions[0].answers)

        return questions
    }

    async createByTeacher(lessonId: number, teacher: IUserCredential, question: QuestionCreateDto) {
        await this.findTestByLessonIdAndTeacherId(lessonId, question.testId, teacher.id)

        const newQuestion = await Question.create({
            type: question.type,
            testId: question.testId,
        })

        return newQuestion
    }

    async updateByTeacher(questionId: number, lessonId: number, teacher: IUserCredential, question: QuestionUpdateDto) {
        const test = await this.findTestByLessonIdAndTeacherId(lessonId, question.testId, teacher.id)

        try {
            const existedQuestion = await Question.findOne({
                where: {id: questionId}
            })
            
            if (!existedQuestion) throw new NotFoundError('Câu hỏi không tồn tại')

            
            await sequelize.transaction(async transaction => {
                await existedQuestion.update({
                    content: question.content,
                    score: question.score,
                    imageLink: question.imageLink,
                    audioLink: question.audioLink,
                })
    
                await Answer.destroy({
                    where: {questionId},
                    transaction
                })
                
                for (const answer of question.answers) {
                    await Answer.create({
                        content: answer.content.trim(),
                        correct: answer.correct,
                        questionId: existedQuestion.id
                    }, {transaction})

                    // const existedAnswer = await Answer.findOne({
                    //     where: {
                    //         id: answer.id ? answer.id : null,
                    //         questionId: answer.questionId
                    //     }  
                    // })

                    // if (existedAnswer) {
                    //     await existedAnswer.update({
                    //         content: answer.content.trim(),
                    //         correct: answer.correct,
                    //         questionId: existedQuestion.id
                    //     }, {transaction})
                    // }
                    // else {
                    //     await Answer.create({
                    //         content: answer.content.trim(),
                    //         correct: answer.correct,
                    //         questionId: existedQuestion.id
                    //     }, {transaction})
                    // }
                }
            })
        } catch (err) {
            console.log(err)
            throw new BadRequestError('Đã có lỗi xảy ra')
        }
    }

    private async findTestByLessonIdAndTeacherId(lessonId: number, testId: number, teacherId: number) {
        const test = await Test.findOne({
            where: {id: testId},
            include: [{
                model: Lesson,
                where: {id: lessonId},
                attributes: [],
                include: [{
                    model: Course,
                    where: {teacherId},
                    attributes: []
                }]
            }]
        })

        if (!test) throw new NotFoundError('Bài kiểm tra không tồn tại')
    }


}