import { Socket } from "socket.io";
import { Service } from "typedi";
import MySocketInterface from "./mySocketInterface";
import JwtService from '../services/JwtService'
import {removeUser, addUser, getUsersInRoom} from './users-global'

interface UserArray {
    id: number;
    room: string
}

class MessageSocket implements MySocketInterface {
    private users: UserArray[]
    private jwtService: JwtService
    constructor() {
        this.users = []
    }
    handleConnection(socket: Socket) {
        socket.emit('ping', 'Hi! I am a live socket connection');
        // socket.handshake.auth.sess
        // console.log(socket)

        socket.on('join_room', (data) => {
            const { senderId, receiverId, role } = data
            var room = `${senderId}-${receiverId}`
            if (role === 'ROLE_TEACHER') {
                room = `${receiverId}-${senderId}`
            }

            const { error, user } = addUser({ id: socket.id, room, userId: senderId })

            if (error) return
            socket.join(room)
            console.log(getUsersInRoom(room))
            console.log('join room')
        })

        socket.on('out_room', (data) => {
            const { senderId, receiverId, role } = data

            var room = `${senderId}-${receiverId}`
            if (role === 'ROLE_TEACHER') {
                room = `${receiverId}-${senderId}`
            }
            console.log('out room')
            removeUser(senderId, room)
            console.log(getUsersInRoom(room))

        })

    }

    middlewareImplementation(socket: Socket, next) {
        return next();
    }
}

export default MessageSocket;