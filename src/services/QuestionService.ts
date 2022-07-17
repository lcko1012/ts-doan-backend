import QuestionUpdateDto, { QuestionCreateDto } from "../dto/QuestionDto";
import IUserCredential from "../interfaces/IUserCredential";
import sequelize from "../models";
import Answer from "../models/Answer";
import Course from "../models/Course";
import Lesson from "../models/Lesson";
import Question from "../models/Question";
import Test from "../models/Test";
import { BadRequestError, NotFoundError } from "routing-controllers";
import { Service } from "typedi";

@Service()
export default class QuestionService {
    constructor() { }

    async getListByTeacher(lessonId: number,
        testId: number, teacher: IUserCredential) {

        await this.findTestByLessonIdAndTeacherId(lessonId, testId, teacher.id)

        const questions = await Question.findAll({
            where: { testId },
            include: [{
                model: Answer,
            }],
            order: [['id', 'ASC'], ['answers', 'id', 'ASC']]
        })

        return questions
    }

    async createByTeacher(lessonId: number, teacher: IUserCredential, question: QuestionCreateDto) {
        await this.findTestByLessonIdAndTeacherId(lessonId, question.testId, teacher.id)

        const newQuestion = await Question.create({
            type: question.type,
            testId: question.testId,
        })

        //update test total score
        const totalScore = await Question.sum('score', {
            where: { testId: question.testId }
        })
        await Test.update({
            totalScore
        }, {
            where: { id: question.testId }
        })

        return newQuestion
    }

    async updateByTeacher(questionId: number, lessonId: number, teacher: IUserCredential, question: QuestionUpdateDto) {
        const test = await this.findTestByLessonIdAndTeacherId(lessonId, question.testId, teacher.id)

        try {
            const existedQuestion = await Question.findOne({
                where: { id: questionId }
            })

            if (!existedQuestion) throw new NotFoundError('Câu hỏi không tồn tại')

            await sequelize.transaction(async transaction => {
                await existedQuestion.update({
                    content: question.content,
                    score: question.score,
                    imageLink: question.imageLink,
                    audioLink: question.audioLink,
                }, { transaction })

                await Answer.destroy({
                    where: { questionId },
                    transaction
                })

                for (const answer of question.answers) {
                    await Answer.create({
                        content: answer.content.trim(),
                        correct: answer.correct,
                        questionId: existedQuestion.id
                    }, { transaction })
                }

                // update test total score
                const totalScore = await Question.sum('score', {
                    where: { testId: question.testId }
                })
                await Test.update({
                    totalScore: totalScore
                }, { where: { id: question.testId }, transaction })
            })
        } catch (err) {
            console.log(err)
            throw new BadRequestError('Đã có lỗi xảy ra')
        }
    }

    async getQuestionsByTestId(testId: number) {
        const questions = await Question.findAll({
            where: { testId },
            include: [{
                model: Answer,
            }],
            order: [['id', 'ASC'], ['answers', 'id', 'ASC']]
        })

        return questions
    }

    async deleteQByTeacher(teacher: IUserCredential, questionId: number) {
        const question = await Question.findOne({
            where: {id: questionId},
        }) 
        if (!question) throw new BadRequestError("Không tìm thấy câu hỏi")

        await question.destroy()
    }

    private async findTestByLessonIdAndTeacherId(lessonId: number, testId: number, teacherId: number) {
        const test = await Test.findOne({
            where: { id: testId },
            include: [{
                model: Lesson,
                where: { id: lessonId },
                attributes: [],
                include: [{
                    model: Course,
                    where: { teacherId },
                    attributes: []
                }]
            }]
        })

        if (!test) throw new NotFoundError('Bài kiểm tra không tồn tại')

        return test;
    }



}