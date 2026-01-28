const { body } = require('express-validator');

const customerValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('Name can only contain letters and spaces'),
  
  body('phone')
    .optional()
    .isLength({ max: 10 })
    .withMessage('Phone number cannot exceed 10 digits')
    .matches(/^[0-9]*$/)
    .withMessage('Phone number can only contain digits'),
];

module.exports = { customerValidation };