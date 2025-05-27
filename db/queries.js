const pool = require('./pool')
const bcryptjs = require('bcryptjs')

async function getAllMessages() {
  const { rows } = await pool.query(
    `SELECT users.user_id, full_name, message_id, title, message, added
    FROM users
    INNER JOIN messages ON users.user_id = messages.user_id
    ORDER BY added;`)
  return rows
}

async function insertUser(firstName, lastName, username, password) {
  const fullName = `${firstName} ${lastName}`
  const hashPword = await bcryptjs.hash(password, 10)
  await pool.query(
    'INSERT INTO users (full_name, username, password) VALUES ($1, $2, $3)',
    [fullName, username, hashPword]
  )
}

async function makeMember(user) {
  const { rows } = await pool.query(
    'UPDATE users SET member = true WHERE user_id = $1',
    [user]
  )
  return rows[0]
}

async function insertMessage(user, title, message) {
  await pool.query(
    'INSERT INTO messages (user_id, title, message, added) VALUES ($1, $2, $3, $4)',
    [user, title, message, new Date()]
  )
}

async function makeAdmin(user) {
  const { rows } = await pool.query(
    'UPDATE users SET admin = true WHERE user_id = $1',
    [user]
  )
  return rows[0]
}

async function deleteMessage(messageId) {
  await pool.query(
    'DELETE FROM messages WHERE message_id = $1',
    [messageId]
  )
}

module.exports = {
  getAllMessages,
  insertUser,
  makeMember,
  insertMessage,
  makeAdmin,
  deleteMessage
}
