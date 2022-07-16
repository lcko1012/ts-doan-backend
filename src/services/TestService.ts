import TestCreateDto, { TestSubmitDto, TestUpdateDto } from "dto/TestDto";
import IUserCredential from "interfaces/IUserCredential";
import Answer from "models/Answer";
import Course from "models/Course";
import Lesson from "models/Lesson";
import Question from "models/Question";
import Test from "models/Test";
import UserTest from "models/UserTest";
import { BadRequestError, NotFoundError } from "routing-controllers";
import { Service } from "typedi";
import CourseService from "./CourseService";
import LessonService from "./LessonService";
import QuestionService from "./QuestionService";

@Service()
export default class TestService {
    constructor(
        readonly lessonService: LessonService,
        readonly courseService: CourseService,
        readonly questionService: QuestionService
    ) { }

    async create(
        body: TestCreateDto,
        teacher: IUserCredential
    ) {
        const lesson = await this.lessonService.findLessonByIdAndTeacherId(body.lessonId, teacher.id);
        await Test.create({
            lessonId: lesson.id,
            name: body.name,
        })
    }

    async getBasic(id: number, lessonId: number, teacher: IUserCredential) {
        const lesson = await this.lessonService.findLessonByIdAndTeacherId(lessonId, teacher.id);
        const test = await Test.findOne({
            where: { id, lessonId: lesson.id },
            attributes: ['id', 'name', 'lessonId', 'passingScore', 'timeLimit', 'createdAt', 'updatedAt', 'updatedAt', 'totalScore']

        })

        if (!test) throw new NotFoundError('Không tìm thấy đề thi')
        return test;
    }

    async update(id: number, body: TestUpdateDto, teacher: IUserCredential) {
        const lesson = await this.lessonService.findLessonByIdAndTeacherId(body.lessonId, teacher.id);
        const test = await Test.findOne({
            where: { id, lessonId: lesson.id },
        })

        if (!test) throw new NotFoundError('Không tìm thấy đề thi')

        await test.update({
            name: body.name,
            passingScore: body.passingScore,
            timeLimit: body.timeLimit,
        })
    }

    async deleteByTeacher(id: number, teacher: IUserCredential) {
        const test = await Test.findOne({
            where: {id},
            include: [{
                model: Lesson,
                attributes: [],
                include: [{
                    model: Course,
                    attributes: [],
                    // where: {teacherId: teacher.id}
                }]
            }]
        })

        if (!test) throw new NotFoundError('Không tìm thấy bài kiểm tra')

        await test.destroy()
    }

    async getTestWithQuestionsByStudent(courseSlug: string, id: number, student: IUserCredential) {
        const course = await Course.findOne({
            where: { slug: courseSlug, isPublic: true }
        })

        if (!course) throw new NotFoundError('Không tìm thấy khóa học')
        //1. check if student is enrolled in course
        const isEnrolled = await this.courseService.checkUserEnrolledCourse(student.id, course.id);

        if (!isEnrolled) throw new NotFoundError('Bạn chưa đăng ký khóa học này')

        const test = await Test.findOne({
            where: { id },
            include: [{
                model: Lesson,
                attributes: [],
                include: [{
                    model: Course,
                    where: { id: course.id },
                    attributes: []
                }],
            }, {
                model: Question, include: [{
                    model: Answer, attributes: {
                        exclude: ['correct']
                    }
                }]
            }]
        })

        if (!test) throw new NotFoundError('Bài kiểm tra không tồn tại')
        // if question is type text, remove content of answer
        test.questions.forEach(question => {
            if (question.type === 'TYPE_TEXT') {
                question.answers.forEach(answer => {
                    answer.content = '';
                })
            }
        })

        return test;
    }

    async submitTestByStudent(courseSlug: string, id: number, student: IUserCredential, testSubmit: TestSubmitDto) {
        const course = await Course.findOne({
            where: { slug: courseSlug, isPublic: true }
        })
        if (!course) throw new NotFoundError('Không tìm thấy khóa học')
        //1. check if student is enrolled in course
        const isEnrolled = await this.courseService.checkUserEnrolledCourse(student.id, course.id);
        if (!isEnrolled) throw new NotFoundError('Bạn chưa đăng ký khóa học này')

        const test = await Test.findOne({
            where: { id },
            include: [{
                model: Lesson,
                attributes: [],
                include: [{
                    model: Course,
                    where: { id: course.id },
                    attributes: []
                }],
            }, { model: Question, include: [{ model: Answer }] }]
        })

        if (!test) throw new NotFoundError('Bài kiểm tra không tồn tại')

        const questionSubmits = testSubmit.questions;
        const questions = test.questions;

        const score = questionSubmits.reduce((acc, questionSubmit) => {
            const question = questions.find(q => q.id === questionSubmit.questionId);
            if (!question) throw new NotFoundError('Câu hỏi không tồn tại')
            if (question.type === "TYPE_MULTIPLECHOICE") {
                //find answers correct
                const correctAnswers = question.answers.filter(answer => answer.correct);
                // compare answers correct and student submit
                const studentAnswers = questionSubmit.answerArray;
                const correct = correctAnswers.every(answer => studentAnswers.includes(answer.id));
                return correct ? acc + question.score : acc;
                // const correctAnswer = question.answers.find(answer => answer.correct);
                // return correctAnswer.id === questionSubmit.answerId ? acc + question.score : acc;
            }
            else if (question.type === "TYPE_TEXT") {
                const correctAnswer = question.answers.find(a => a.correct);
                // compare answers correct and student submit, content of correct is spreaded by ,
                const correct = correctAnswer.content.split(',').some(content => content.toLowerCase() === questionSubmit.answerContent.toLowerCase());
                return correct ? acc + question.score : acc;
            }

            return acc;
        }, 0);
       
        const details = questionSubmits.map(questionSubmit => {
            const question = questions.find(q => q.id === questionSubmit.questionId);
            if (!question) throw new NotFoundError('Câu hỏi không tồn tại')
            var answer;
            if (question.type === "TYPE_TEXT"){
                const correctAnswer = question.answers.find(a => a.correct);
                // compare answers correct and student submit, content of correct is spreaded by ,
                answer = correctAnswer.content.split(',').some(content => content.toLowerCase() === questionSubmit.answerContent.toLowerCase());
            }
            else answer = question.answers.every(a => questionSubmit.answerArray.includes(a.id));
            return {
                questionId: question.id,
                answerSubumitId: questionSubmit.answerArray,
                answerSubmitContent: questionSubmit.answerContent,
                correct: answer ? answer.correct : false,
                question
            }
        })

        const result = {
            userId: student.id,
            testId: test.id,
            score,
            details: JSON.stringify(details),
            isPass: score >= test.passingScore,
        }

        const testResult = await UserTest.create(result);

        if (!testResult) throw new BadRequestError('Không thể lưu kết quả')

        return {
            score: testResult.score,
            id: testResult.id,
            totalScore: test.totalScore
        };
    }
}