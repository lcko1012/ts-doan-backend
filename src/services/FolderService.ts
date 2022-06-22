import { FolderCreateingDto } from "dto/FolderDto";
import IUserCredential from "interfaces/IUserCredential";
import Example from "models/Example";
import Folder from "models/Folder";
import Kind from "models/Kind";
import Meaning from "models/Meaning";
import Word from "models/Word";
import WordKind from "models/WordKind";
import { NotFoundError } from "routing-controllers";
import { Service } from "typedi";
import StringUtils from "utils/StringUtils";

@Service()
export default class FolderService {
    constructor() { }

    public async getDetails(id: number, user: IUserCredential) {
        const folder = await Folder.findOne({
            where: {id, userId: user.id},
            include: [{
                model: Word,
                include: [{
                    model: WordKind,
                    include: [{
                        model: Meaning,
                        include: [{
                            model: Example
                        }]
                    }, {
                        model: Kind
                    }]
                }]
            }]
        })

        if (!folder) throw new NotFoundError("Thư mục không tồn tại");

        return folder;
    }

    public async create(newFolder: FolderCreateingDto, user: IUserCredential) {
        var slug = StringUtils.createSlug(newFolder.name);
        
        const folder = await Folder.create({
            name: newFolder.name,
            userId: user.id,
            slug: slug,
        })

        return folder;
    }
}