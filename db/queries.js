const pool = require('./pool')

async function getAllMessages() {
  const { rows } = await pool.query('SELECT * FROM messages')
  return rows
}

async function insertUser(firstName, lastName, username, password) {
  const fullName = `${firstName} ${lastName}`
  await pool.query(
    `INSERT INTO users (full_name, username, password) VALUES ($1, $2, $3)`,
    [fullName, username, password]
  )
}

module.exports = {
  getAllMessages,
  insertUser
}
