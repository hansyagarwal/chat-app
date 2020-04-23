const express = require('express')
const http = require('http')
const path = require('path')
const socketio = require('socket.io')
const Filter =  require('bad-words')
const {generateMessage, generateLocationMessage } = require('./utils/messages')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

const port = process.env.PORT || 3000
const publicDirectoryPath = path.join(__dirname, '../public')

app.use(express.static(publicDirectoryPath))

//let count = 0
io.on('connection',(socket)=>{
    console.log('New webSocket connection')
    
    socket.on('join', ({username, room})=>{
        socket.join(room)
        //to send to socket only
        socket.emit('message', generateMessage('Welcome!'))
        //to send to everyone except the socket
        socket.broadcast.to(room).emit('message', generateMessage(`${username} has joined`))
        //io.to.emit send message to everyone in room       
    })

    socket.on('sendMessage',(message,callback) => {
        const filter = new Filter()

        if(filter.isProfane(message)) {
            return callback('Profanity is not allowed')
        }
        //to send to everyone
        io.to('Jaipur').emit('message', generateMessage(message))
        callback()
    })

    socket.on('sendLocation',(coords, callback)=>{
        io.emit('locationMessage', generateLocationMessage(`https://google.com/maps?q=${coords.latitude},${coords.longitude}`))
        callback()
    })

    //when a user disconnects
    socket.on('disconnect', ()=>{
        io.emit('message', generateMessage('A user has left'))
    })
})

server.listen(port, ()=>{
    console.log('Sever is up on port: ' + port)
})