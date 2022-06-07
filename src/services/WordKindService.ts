import WordKind from "models/WordKind";
import { BadRequestError, NotFoundError } from "routing-controllers";
import { Service } from "typedi";

@Service()
export default class WordKindService {
    constructor(){}

    public async createWordKind(wordId: number, kindId: number) {
        const wordKind = await WordKind.findOne({
            where: {wordId, kindId}
        })

        if (wordKind) throw new BadRequestError('Từ loại đã tồn tại');

        const newWordKind = WordKind.build({
            wordId,
            kindId,
        })

        await newWordKind.save();
    }

    public async deleteWordKind(wordId: number, kindId: number) {
        const wordKind = await WordKind.findOne({
            where: {
                wordId,
                kindId,
            },
        });

        if (!wordKind) throw new NotFoundError('Không tìm thấy từ loại và các định nghĩa này');

        return await wordKind.destroy();
    }
}