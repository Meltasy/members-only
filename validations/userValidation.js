const { body } = require('express-validator')

const reqErr = 'is required.'
const lengthErr = 'must be between 3 and 30 characters.'
const inclErr = 'must only contain letters and spaces.'

const validateNewUser = [
  body('firstName')
    .trim()
    .notEmpty().withMessage(`Name ${reqErr}`)
    .isLength({ min: 3, max: 30 }).withMessage(`Name ${lengthErr}`)
    .matches(/^[A-Za-z\s]+$/).withMessage(`Name ${inclErr}`),
  body('lastName')
    .trim()
    .notEmpty().withMessage(`Surname ${reqErr}`)
    .isLength({ min: 3, max: 30 }).withMessage(`Surname ${lengthErr}`)
    .matches(/^[A-Za-z\s]+$/).withMessage(`Surname ${inclErr}`),
  body('username')
    .notEmpty().withMessage(`Email ${reqErr}`)
    .isEmail().withMessage('This is not a valid email address.')
    .isLength({ min: 6, max: 60 }).withMessage('Email must be between 6 and 60 characters.')
    .normalizeEmail({ gmail_remove_dots: false }),
  body('password')
    .trim()
    .notEmpty().withMessage(`Password ${reqErr}`)
    .isLength({ min: 8, max: 24 }).withMessage('Password must be between 8 and 24 characters.')
    .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).*$/).withMessage('Password must contain one number, one lowercase letter, one uppercase letter, one special character and no spaces.'),
  body('confirmPassword')
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Passwords do not match.')
      }
      return true
    })
]

module.exports = { validateNewUser }
