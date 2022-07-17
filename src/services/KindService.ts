import Kind from "../models/Kind";
import Word from "../models/Word";
import WordKind from "../models/WordKind";
import WordRepository from "../repository/WordRepository";
import { BadRequestError } from "routing-controllers";
import { Service } from "typedi";

@Service()
export default class KindService {
    constructor(
        readonly wordRepository: WordRepository
    ){}
    
    public async getKindById(id: number) {
        const kind = await Kind.findByPk(id);
        return kind;
    }

    public async getAllKinds() {
        return await Kind.findAll({
            order: [['name', 'ASC']]
        });
    }

    public async getKindsForWord(id: number) {
        const word = await Word.findOne({
            where: {id},
            include: [
                {model: Kind}
            ]
        });
        if (!word) throw new BadRequestError('Không tìm thấy từ vựng')

        const kinds =  await this.getAllKinds();

        if (word.kinds.length === 0) return kinds;

        const kindsForWord = kinds.filter(kind => (
            word.kinds.find(wordKind => wordKind.id !== kind.id)
        ))

        return kindsForWord;
    }

    public async updateKindsOfWord(wordId: number, oldKindId: number, newKindId: number) {
        const wordKind = await WordKind.findOne({
            where: {
                wordId,
                kindId: oldKindId
            }
        });
        
        if (!wordKind) throw new BadRequestError('Không tìm thấy từ loại')

        await WordKind.update({
            kindId: newKindId
        }, {where: {wordId: wordId, kindId: oldKindId}});
    }
}
