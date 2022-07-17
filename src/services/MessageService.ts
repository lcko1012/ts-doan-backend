import { MessageDto } from "../dto/MessageDto";
import IUserCredential from "../interfaces/IUserCredential";
import Message from "../models/Message";
import { Op, Sequelize } from "sequelize";
import { Service } from "typedi";
import Websocket from "../websocket/websocket";
import User from "../models/User"
import sequelize from "../models";
import { getUsers, getUsersInRoom } from "../websocket/users-global";

@Service()
export default class MessageService {
    private readonly io: Websocket;

    constructor(){
        this.io = Websocket.getInstance();
    }

    async getByTeacherIdAndUserId(senderId: number, receiverId: number) {
        const messages = await Message.findAll({
            where: {
                [Op.or]: [{
                    [Op.and]: [
                        {senderId: senderId},
                        {receiverId: receiverId}
                    ]
                }, {
                   [Op.and]: [
                        {senderId: receiverId},
                        {receiverId: senderId}
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
            msg.myMessage = msg.senderId === senderId ? true : false
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
        return message
    }

    async getUserListMsgByTeacher(teacher: IUserCredential) {
        const list = await Message.findAll({
            where: {receiverId: teacher.id},
            attributes: [[sequelize.fn('DISTINCT', sequelize.col('senderId')), 'senderId']]
        })

        var result = list.map(d => d.toJSON())

        for(var user of result) {
            var info = await User.findOne({where: {id: user.senderId}, attributes: {
                exclude: ['password']
            }})
            user.user = info
        }

        return result
    }

    private updateSockets(message: Message, room: string) {
        this.io.of('message').to(room).emit('notification', { data: message.senderId });
        const users = getUsers();
        var indexUser = users.findIndex((user) => user.userId == message.receiverId && user.room != room)
        if (indexUser !== -1) {
            this.io.of('message').to(users[indexUser].id).emit('invited', {senderId: message.senderId})
        }
    }

    private joinPrivateChatSockets(senderId: number, receiverId: number, room: string){
        // this.io.of('message').socketsJoin('userId-teacherId')
        // this.io.of('message').emit('load_messages');
        
    }
}