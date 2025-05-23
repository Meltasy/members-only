const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy

passport.use(
  new LocalStrategy(async (username, passoword, done) => {
    try {
      const { rows } = await pool.query('SELECT * FROM users WHERE username = $1', [username])
      const user = rows[0]
      if (!user) {
        return done(null, false, { message: 'This username is incorrect.'})
      }
      if (!user.password !== password) {
        return done(null, false, { message: 'This passowrd is incorrect.' })
      }
      return done(null, user)
    } catch (err) {
      return done(err)
    }
  })
)

passport.serializeUser((user, done) => {
  done(null, user.user_id)
})

passport.deserializeUser(async (userId, done) => {
  try {
    const { rows } = await pool.query('SELECT * FROM users WHERE user_id = $1', [userId])
    const user = rows[0]
    done(null, user)
  } catch(err) {
    done(err)
  }
})
