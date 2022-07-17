import { IdiomDto } from "../dto/WordDto";
import Idiom from "../models/Idiom";
import WordKind from "../models/WordKind";
import { NotFoundError } from "routing-controllers";
import { Service } from "typedi";

@Service()
export default class IdiomService {
    constructor(){}

    public async createIdiom(newIdiom: IdiomDto) {
        await Idiom.create({
            name: newIdiom.name,
            mean: newIdiom.mean,
            wordKindId: newIdiom.wordKindId
        })
    }

    public async updateIdiom(id: number, newIdiom: IdiomDto) {
        const existedIdiom = await Idiom.findOne({
            where: {id},
            include: [{
                model: WordKind,
                where: {id: newIdiom.wordKindId}
            }]
        })

        if (!existedIdiom) throw new NotFoundError('Không tìm thấy thành ngữ')

        // existedIdiom.update()

        await existedIdiom.update({
            name: newIdiom.name,
            mean: newIdiom.mean
        })
    }

    public async deleteIdiom(id: number) {
        const existedIdiom = await Idiom.findOne({
            where: {id}
        })

        if (!existedIdiom) throw new NotFoundError('Không tìm thấy thành ngữ')

        await existedIdiom.destroy()
    }
}