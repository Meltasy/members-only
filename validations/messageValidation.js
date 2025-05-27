const { body } = require('express-validator')

const reqErr = 'is required.'
const inclErr = 'must only contain letters and spaces.'

const validateNewMessage = [
  body('title')
    .trim()
    .notEmpty().withMessage(`Title ${reqErr}`)
    .isLength({ min: 3, max: 60 }).withMessage('Title must be between 3 and 60 characters.')
    .matches(/^[A-Za-z\s]+$/).withMessage(`Title ${inclErr}`),
  body('message')
    .trim()
    .notEmpty().withMessage(`Message ${reqErr}`)
    .isLength({ min: 3, max: 250 }).withMessage('Message must be between 3 and 250 characters.')
    .matches(/^[A-Za-z\s]+$/).withMessage(`Message must be between 3 and 250 characters.`)
]

module.exports = { validateNewMessage }
