#! /usr/bin/env node

require('dotenv').config()
const { Client } = require('pg')
const bcryptjs = require('bcryptjs')

const SQL= `
CREATE TABLE IF NOT EXISTS users (
  user_id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  username VARCHAR ( 100 ),
  password VARCHAR ( 100 ),
  full_name VARCHAR ( 60 ),
  member BOOLEAN DEFAULT FALSE,
  admin BOOLEAN DEFAULT FALSE
);
  
CREATE TABLE IF NOT EXISTS messages (
  message_id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  user_id INTEGER REFERENCES users,
  title VARCHAR ( 60 ),
  message VARCHAR ( 255 ),
  added TIMESTAMP
);
`

const userList = [
  { username: 'joe.bloggs@gmail.com', password: 'JBloggs1979£$', firstName: 'Joe', lastName: 'Bloggs', member: true, admin: true, title: 'Hello!', message: 'My name is Joe Bloggs and I\'m a made-up person.' },
  { username: 'sarah.smith@hotmail.com', password: 'SassyS&M69', firstName: 'Sarah', lastName: 'Smith', member: false, admin: false, title: 'Oh my darling!', message: 'My name is Sassy Sarah and I\'m a sexy lady.' },
  { username: 'mr.white@tarantino.org', password: 'WhiteISBlack*8*', firstName: 'Mister', lastName: 'White', member: false, admin: false, title: 'Don\'t move!', message: 'You don\'t know me and I don\'t know you.' },
  { username: 'tantwaneng@writers.org', password: 'Garden3v3ning^^ists', firstName: 'Tan Twan', lastName: 'Eng', member: false, admin: false, title: 'The end', message: 'He walked into the jungle, never to be seen again.' },
  { username: 'lamajiao@pm.me', password: 'FREE888:-)now', firstName: 'La Ma', lastName: 'Jiao', member: false, admin: false, title: 'Driver', message: 'Where do you want to go? Let\'s head into the mountains.' },
  { username: 'andy.dufresne@outlook.com', password: 'HopeIS****1966', firstName: 'Andy', lastName: 'Dufresne', member: false, admin: false, title: 'Let me go!', message: 'Some birds weren\'t meant to be caged!' }
]

async function main() {
  console.log('Creating tables ...')
  const client = new Client({
    connectionString: process.env.CONNECTION_STRING
  })
  await client.connect()
  await client.query(SQL)

  for (let user of userList) {
    const fullName = `${user.firstName} ${user.lastName}`
    const hashPword = await bcryptjs.hash(user.password, 10)
    const { rows } = await client.query(
      `INSERT INTO users (username, password, full_name, member, admin)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING user_id;`,
      [user.username, hashPword, fullName, user.member, user.admin]
    )
    const userId = rows[0].user_id
    await client.query(
      `INSERT INTO messages (user_id, title, message, added)
      VALUES ($1, $2, $3, NOW());`,
      [userId, user.title, user.message]
    )
  }

  await client.end()
  console.log('Done!')
}

main().catch(err => console.error('Error running script: ', err))
