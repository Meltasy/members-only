const { body } = require('express-validator')

const reqErr = 'is required.'
const lengthErr = 'must be between 3 and 30 characters.'

const validateNewUser = [
  body('firstName')
    .trim()
    .notEmpty().withMessage(`Name ${reqErr}`)
    .isLength({ min: 3, max: 30 }).withMessage(`Name ${lengthErr}`),
  body('lastName')
    .trim()
    .notEmpty().withMessage(`Surname ${reqErr}`)
    .isLength({ min: 3, max: 30 }).withMessage(`Surname ${lengthErr}`),
  body('username')
    .notEmpty().withMessage(`Email ${reqErr}`)
    .isEmail().withMessage('This is not a valid email address.')
    .isLength({ min: 3, max: 60 }).withMessage('Email must be between 3 and 60 characters.')
    .normalizeEmail(),
  body('password')
    .trim()
    .notEmpty().withMessage(`Password ${reqErr}`)
    .isLength({ min: 8, max: 24 }).withMessage('Password must be between 8 and 24 characters.'),
  body('confirmPassword')
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Passwords do not match.')
      }
      return true
    })
]

module.exports = {
  validateNewUser
}
