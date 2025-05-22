const { body } = require('express-validator')

const reqErr = 'is required.'
const lengthErr = 'must be between 3 and 30 characters.'

const validateNewUser = [
  body('firstName').trim().notEmpty().withMessage(`Name ${reqErr}`)
    .isLength({ min: 3, max: 30 }).withMessage(`Name ${lengthErr}`)
]

module.exports = {
  validateNewUser
}
