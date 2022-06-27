interface UserArray {
    id: any;
    room: string;
    userId: number;
}

var users = []


export const addUser = ({ id, room, userId }: { id: any, room: string, userId: number }) => {
    room = room.trim().toLowerCase()

    const existingUser = users.find(user => user.room === room && user.id === id)

    if (existingUser) {
        return { error: 'Đã vào tin nhắn' }
    }

    const user = { id, room, userId }

    users.push(user)

    return { user }
}


export const removeUser = (userId: number, room: string) => {
    const index = users.findIndex((user) => user.userId === userId && user.room === room)

    if (index !== -1) {
        return users.splice(index, 1)[0]
    }
}

export const getUsersInRoom = (room: string) => {
    return users.filter(user => user.room === room)
}

export const getUsers = () => {
    return users;
}
