const { Server } = require("socket.io")

exports.socketConnection = (server) => {
    const io = new Server(server, {
        cors: {
            origin: "*",
            methods: "*"
        }
    })

    const namespace = io.of("/chat")

    namespace.on("connection", (socket) => {
        console.log("socket connect to server")

        // EVENT LISTENER HERE
        socket.on("JOIN_ROOM", (room) => {
            // ALL LOGIC WHEN USER JOIN ROOM GOES HERE
            if(room.lastRoom) {
                console.log("User leave from room " + room.lastRoom)
                socket.leave(room.lastRoom)
                
                const isRoomAvaiable = socket.nsp.adapter.rooms.get(room.lastRoom)
                if (isRoomAvaiable) {
                // get user left in last room
                const usersOnlineInRoom = socket.nsp.adapter.rooms.get(room.lastRoom).size.toString()
                //console.log("USERS ONLINE IN ROOM", usersOnlineInRoom)
                socket.nsp.to(room.lastRoom).emit("USERS_LEFT_IN_ROOM", usersOnlineInRoom)
                } 
            }
            console.log("ROOM", room)
            socket.join(room.currentRoom)

            // GET DATA CHAT KE DATABASE

            // PROSES EMIT

            // to get how many users join in room
            const usersOnlineInRoom = socket.nsp.adapter.rooms.get(room.currentRoom).size.toString()
            console.log("USERS ONLINE IN ROOM", usersOnlineInRoom)
            socket.nsp.to(room.currentRoom).emit("RECEIVE_USERS_ONLINE_IN_ROOM", usersOnlineInRoom)

            
            console.log("User with id "
             + socket.id + " join to room " + room.currentRoom)
        })

        socket.on("SEND_MESSAGE", (dataMessage) => {
            // ALL LOGIC WHEN SEND MESSAGE GOES HERE
            console.log("DATA MESSAGE", dataMessage)
            // basic emit
            //socket.emit("RECEIVE_MESSAGE", dataMessage)

            // global messages which connect to this namespace
            //namespace.emit("RECEIVE_MESSAGE", dataMessage)

            // for all client except sender
            //socket.broadcast.emit("RECEIVE_MESSAGE", dataMessage)

            // emit to specific room
            socket.nsp.to(dataMessage.room).emit("RECEIVE_MESSAGE", dataMessage)
        })

        socket.on("IS_TYPING", (data) => {
            socket.broadcast.to(data.room).emit("RECEIVE_TYPING", data.isTyping)
        })
    })
}