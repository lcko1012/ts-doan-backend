import { LessonCreatingDto } from "dto/LessonDto";
import IUserCredential from "interfaces/IUserCredential";
import Course from "models/Course";
import Lesson from "models/Lesson";
import { Service } from "typedi";
import StringUtils from "utils/StringUtils";

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
        while (slug === existedLesson.slug) {
            slug = slug + '-' + StringUtils.randomInt(1, 10);
        }
        
        await Lesson.create({
            name: lesson.name,
            courseId: course.id,
            slug
        })
    }

    public async getWords(lessonId: number) {
        
    }
}
