import TestCreateDto, { TestUpdateDto } from "dto/TestDto";
import IUserCredential from "interfaces/IUserCredential";
import Test from "models/Test";
import { NotFoundError } from "routing-controllers";
import { Service } from "typedi";
import LessonService from "./LessonService";

@Service()
export default class TestService {
    constructor(
        readonly lessonService: LessonService
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
            where: {id, lessonId: lesson.id},
            attributes: ['id', 'name', 'lessonId', 'passingScore', 'timeLimit', 'createdAt', 'updatedAt', 'updatedAt']

        })

        if (!test) throw new NotFoundError('Không tìm thấy đề thi')
        return test;
    }

    async update(id: number, body: TestUpdateDto, teacher: IUserCredential) {
        const lesson = await this.lessonService.findLessonByIdAndTeacherId(body.lessonId, teacher.id);
        const test = await Test.findOne({
            where: {id, lessonId: lesson.id},
        })

        if (!test) throw new NotFoundError('Không tìm thấy đề thi')
       
        await test.update({
            name: body.name,
            passingScore: body.passingScore,
            timeLimit: body.timeLimit,
        })
    }
}