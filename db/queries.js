const pool = require('./pool')

// async function getAllMessages() {
//   const { rows } = await pool.query('SELECT * FROM messages')
//   return rows
// }

async function insertUser(firstName, lastName, username, password) {
  await pool.query(
    `INSERT INTO users (firstName, lastName, username, password) VALUES ($1, $2, $3, $4)`,
    [firstName, lastName, username, password]
  )
}

module.exports = {
  // getAllMessages,
  insertUser
}
