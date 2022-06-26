import { MessageDto } from "dto/MessageDto";
import IUserCredential from "interfaces/IUserCredential";
import Message from "models/Message";
import { Op } from "sequelize";
import { Service } from "typedi";
import Websocket from "websocket/websocket";

@Service()
export default class MessageService {
    private readonly io: Websocket;

    constructor(){
        this.io = Websocket.getInstance();
    }

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

        // this.joinPrivateChatSockets()

        return customeMessages.reverse();
    }

    async send(data: MessageDto, user: IUserCredential) {
        const message = await Message.create({
            senderId: user.id,
            receiverId: data.receiverId,
            content: data.content.trim()
        })

        var room = `${user.id}-${data.receiverId}`
        if (user.role === 'ROLE_TEACHER'){
            room = `${data.receiverId}-${user.id}`
        }
        console.log('roomname:', room)

        this.updateSockets(message, room)
        console.log(message)
        return message
    }

    private updateSockets(message, room) {
        this.io.of('message').to(room).emit('notification', { data: message });
    }

    private joinPrivateChatSockets(userId: number, teacherId: number){
        // this.io.of('message').socketsJoin('userId-teacherId')
        // this.io.of('message').emit('load_messages');
    }
}