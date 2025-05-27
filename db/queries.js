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
    `INSERT INTO users (full_name, username, password) VALUES ($1, $2, $3)`,
    [fullName, username, hashPword]
  )
}

async function makeMember(user) {
  const { rows } = await pool.query(
    `UPDATE users
    SET member = true
    WHERE user_id = $1`,
    [user]
  )
  return rows[0]
}

module.exports = {
  getAllMessages,
  insertUser,
  makeMember
}
