/** @format */
const chatForm = document.querySelector('#chat-form')
const chatMessages = document.querySelector('.chat-messages')
const roomName = document.querySelector('#room-name')
const roomUsers = document.querySelector('#users')

// Get username and room from URL
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
})

const socket = io()

// Output Message to DOM
const outputMessage = (message) => {
  const div = document.createElement('div')
  div.classList.add('message')
  div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
                    <p class="text">
                    ${message.text}
                    </p>`

  document.querySelector('.chat-messages').appendChild(div)
}

const outputRoomNameAndRoomMembers = (users) => {
  roomName.innerText = users[0].room

  roomUsers.innerHTML = `
    ${users.map((user) => `<li>${user.username}</li>`).join('')}
    `
}

// Join Chatroom
socket.emit('joinRoom', { username, room })

// Get Room Users
socket.on('roomUsers', (users) => {
  outputRoomNameAndRoomMembers(users)
})

// Get message from server
socket.on('message', (message) => {
  outputMessage(message)

  // Scroll down
  chatMessages.scrollTop = chatMessages.scrollHeight
})

chatForm.addEventListener('submit', (e) => {
  e.preventDefault()

  // Get message text
  const message = e.target.elements.message.value

  // Emit message to server
  socket.emit('chatMessage', message)

  // Clear input
  e.target.elements.message.value = ''
  e.target.elements.message.focus()
})
