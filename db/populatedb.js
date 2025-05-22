#! /usr/bin/env node

require('dotenv').config()
const { Client } = require('pg')

const SQL= `
CREATE TABLE IF NOT EXISTS users (
  user_id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  username VARCHAR ( 100 ),
  password VARCHAR ( 100 ),
  full_name VARCHAR ( 60 ),
  member BOOLEAN DEFAULT FALSE,
  admin BOOLEAN DEFAULT FALSE
);

INSERT INTO users (username, password, full_name)
VALUES ('joe.bloggs@gmail.com', 'thisIsHashedPassword', 'Joe Bloggs');
  
CREATE TABLE IF NOT EXISTS messages (
  message_id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  user_id INTEGER REFERENCES users,
  title VARCHAR ( 60 ),
  message VARCHAR ( 255 ),
  added TIMESTAMP
);

INSERT INTO messages (user_id, title, message, added)
VALUES (1, 'Hello', 'My name is Joe Bloggs and I''m a made-up person.', NOW());
`
async function main() {
  console.log('Creating tables ...')
  const client = new Client({
    connectionString: process.env.CONNECTION_STRING
  })
  await client.connect()
  await client.query(SQL)
  await client.end()
  console.log('Done!')
}

main().catch(err => console.error('Error running script: ', err))
