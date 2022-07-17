import { LessonCreatingDto } from "../dto/LessonDto";
import IUserCredential from "../interfaces/IUserCredential";
import Course from "../models/Course";
import Example from "../models/Example";
import Idiom from "../models/Idiom";
import Kind from "../models/Kind";
import Lesson from "../models/Lesson";
import Meaning from "../models/Meaning";
import Word from "../models/Word";
import WordKind from "../models/WordKind";
import { NotFoundError } from "routing-controllers";
import { Service } from "typedi";
import StringUtils from "../utils/StringUtils";

@Service()
export default class LessonService {
    constructor() { }

    public async createLesson(
        lesson: LessonCreatingDto, 
        user: IUserCredential) 
    {
        const course = await Course.findOne({
            where: {id: lesson.courseId, teacherId: user.id}
        })
        if (!course) throw new Error('Không tìm thấy khóa học');
        
        var slug = StringUtils.createSlug(lesson.name);
        var existedLesson = await Lesson.findOne({
            where: {name: lesson.name, courseId: course.id}
        })

        if (existedLesson) throw new Error('Tên bài học không được trùng')

        var existedSlug = await Lesson.findOne({
            where: {slug, courseId: course.id}
        })

        while (existedSlug) {
            slug = slug + '-' + StringUtils.randomInt(1, 10);
            existedSlug = await Lesson.findOne({
                where: {slug, courseId: course.id}
            })
        }
        
        await Lesson.create({
            name: lesson.name,
            courseId: course.id,
            slug
        })
    }

    public async getLessonInCourseById(
        lessonId: number, courseId: number, user: IUserCredential)
    {
        const lesson = await Lesson.findOne({
            where: {id: lessonId},
            include: [{model: Course, where: {id: courseId, teacherId: user.id}}]
        })

        if (!lesson) throw new NotFoundError('Bài học không tồn tại')

        return lesson;
    }

    public async getLessonInCourseBySlug(
        lessonSlug: string, 
        courseSlug: string, user: IUserCredential) 
    {
        const lesson = await Lesson.findOne({
            where: {slug: lessonSlug},
            include: [{model: Course, where: {slug: courseSlug, teacherId: user.id}}]
        })

        if (!lesson) throw new NotFoundError('Bài học không tồn tại')

        return lesson;
    }

    public async getFlashcard(lessonId: number, user: IUserCredential) {
        const lesson = await this.findLessonByIdAndTeacherId(lessonId, user.id);
        
        const words = await Word.findAll({
            include: [
                {
                    model: WordKind.scope('do_not_get_time'),
                    include: [
                        {model: Meaning, include: [{model: Example}]},
                        {model: Kind},
                        {model: Idiom}
                    ]
                },
                {
                    model: Lesson,
                    where: {id: lesson.id},
                    attributes: []
                }
            ]
        })

        return words;
    }

    public async delete(lessonId: number, user: IUserCredential) {
        const lesson = await this.findLessonByIdAndTeacherId(lessonId, user.id);
        await lesson.destroy();
    }

    public async updateName(lessonId: number , name: string, user: IUserCredential) {
        const lesson = await this.findLessonByIdAndTeacherId(lessonId, user.id);
        lesson.name = name;
        await lesson.save();
    }


    public async findLessonByIdAndTeacherId(lessonId: number, teacherId: number) {
        const lesson = await Lesson.findOne({
            where: {id: lessonId},
            include: [{model: Course, where: {teacherId}}]
        })
        if (!lesson) throw new NotFoundError('Bài học không tồn tại')   
        return lesson;
    }
}
