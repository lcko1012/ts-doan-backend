import { MessageDto } from "dto/MessageDto";
import IUserCredential from "interfaces/IUserCredential";
import Message from "models/Message";
import { Op } from "sequelize";
import { Service } from "typedi";

@Service()
export default class MessageService {
    constructor(){}
    async getByTeacherIdAndUserId(teacherId: number, userId: number) {
        const messages = await Message.findAll({
            where: {
                [Op.or]: [{
                    [Op.and]: [
                        {senderId: teacherId},
                        {receiverId: userId}
                    ]
                }, {
                   [Op.and]: [
                        {senderId: userId},
                        {receiverId: teacherId}
                   ] 
                }]
            },
            limit: 20,
            order: [['createdAt', 'desc']]
        })

        //check if message is mine
        var customeMessages = messages.map(msg => (
            msg.toJSON()
        ))

        for(var msg of customeMessages){
            msg.myMessage = msg.senderId === userId ? true : false
        }

        return customeMessages.reverse();
    }

    async send(data: MessageDto, user: IUserCredential) {
        const message = await Message.create({
            senderId: user.id,
            receiverId: data.receiverId,
            content: data.content.trim()
        })

        return message
    }
}