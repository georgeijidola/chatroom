/** @format */

const users = []

// Join User to chat
const userJoin = (user) => {
  const { id, username, room } = user

  users.push(user)

  return user
}

// Get current user
const getCurrentUser = (id) => {
  return users.find((user) => user.id === id)
}

// User leaves chat
const userLeave = (id) => {
  const index = users.findIndex((user) => user.id === id)

  if (index !== -1) {
    return users.splice(index, 1)[0]
  }
}

// Get room users
const getRoomUsers = (room) => {
  return users.filter((user) => user.room === room)
}

module.exports = {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers,
}
