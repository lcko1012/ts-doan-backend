import sequelize from "models";
import Course from "models/Course";
import Lesson from "models/Lesson";
import { Service } from "typedi";

@Service()
export default class CourseRepository {
    // public async findByTopic(topicId: number): Promise<Course[]> {
    //     return await Course.findAll({
    //         where: {
    //             topicId
    //         }
    //     })
    // }

    public async findBySlug(slug: string): Promise<Course | null> { 
        return await Course.findOne({
            where: {slug},
            include: [{
                model: Lesson
            }]
        })
    }

    public async getMaxPriority(topicId: number): Promise<number> {
        return await Course.max('priority', {
            where: {topicId}
        });
    }

    public async getAllCourses(page: number, size: number, 
        courseNameCondition: any) {
        const courses = await Course.findAndCountAll({
            offset: page * size,
            limit: size,
            where: courseNameCondition,
            // raw: true,
            // nest: true
        })

        return courses;
    }
}