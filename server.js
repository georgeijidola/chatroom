/** @format */
const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')
const formatMessage = require('./utils/messages')
const {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers,
} = require('./utils/users')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

// Set Static Folder
app.use(express.static(path.join(__dirname, 'public')))

// Set Bot name
const botName = 'ChatRoom Bot'

// Run when a client connects
io.on('connection', (socket) => {
  socket.on('joinRoom', ({ username, room }) => {
    const user = userJoin({ id: socket.id, username, room })

    socket.join(user.room)

    socket.emit(
      'message',
      formatMessage({
        username: botName,
        text: 'Welcome to ChatRoom',
      })
    )

    // Broadcast when a user connects
    socket.broadcast.to(user.room).emit(
      'message',
      formatMessage({
        username: botName,
        text: `${user.username} has joined the chat`,
      })
    )

    // Send users and room info
    io.to(user.room).emit('roomUsers', getRoomUsers(user.room))
  })

  // Listen for chatMessage
  socket.on('chatMessage', (message) => {
    const user = getCurrentUser(socket.id)
    io.to(user.room).emit(
      'message',
      formatMessage({ username: user.username, text: message })
    )
  })

  // Runs when client disconnects
  socket.on('disconnect', () => {
    const user = userLeave(socket.id)

    if (user) {
      io.to(user.room).emit(
        'message',
        formatMessage({
          username: botName,
          text: `${user.username} has left the chat`,
        })
      )

      io.to(user.room).emit('roomUsers', getRoomUsers(user.room))
    }
  })
})

// Init Middleware
app.use(
  express.json({
    extended: true,
  })
)
app.use(
  express.urlencoded({
    extended: true,
  })
)

const PORT = process.env.PORT || 3000

server.listen(PORT, () => console.log(`Server started on port ${PORT}`))
