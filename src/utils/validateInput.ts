import { body, param, query, ValidationChain } from 'express-validator';

/**
 * Validation rules for creating a user
 */
export const createUserValidation: ValidationChain[] = [
  body('name')
    .notEmpty()
    .withMessage('Name is required')
    .isString()
    .withMessage('Name must be a string'),
  
  body('email')
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Invalid email format'),
  
  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isString()
    .withMessage('Password must be a string'),
  
  body('phone')
    .optional()
    .isString()
    .withMessage('Phone must be a string'),
  
  body('userTypeId')
    .notEmpty()
    .withMessage('User type ID is required')
    .isInt()
    .withMessage('User type ID must be an integer'),
];

/**
 * Validation rules for updating a user
 */
export const updateUserValidation: ValidationChain[] = [
  param('userId')
    .notEmpty()
    .withMessage('User ID is required')
    .isUUID()
    .withMessage('Invalid user ID format'),
  
  body('name')
    .optional()
    .isString()
    .withMessage('Name must be a string'),
  
  body('email')
    .optional()
    .isEmail()
    .withMessage('Invalid email format'),
  
  body('phone')
    .optional()
    .isString()
    .withMessage('Phone must be a string'),
  
  body('userTypeId')
    .optional()
    .isInt()
    .withMessage('User type ID must be an integer'),
];

/**
 * Validation rules for changing a user's password
 */
export const changePasswordValidation: ValidationChain[] = [
  param('userId')
    .notEmpty()
    .withMessage('User ID is required')
    .isUUID()
    .withMessage('Invalid user ID format'),
  
  body('currentPassword')
    .notEmpty()
    .withMessage('Current password is required')
    .isString()
    .withMessage('Current password must be a string'),
  
  body('newPassword')
    .notEmpty()
    .withMessage('New password is required')
    .isString()
    .withMessage('New password must be a string'),
  
  body('confirmPassword')
    .notEmpty()
    .withMessage('Confirm password is required')
    .isString()
    .withMessage('Confirm password must be a string')
    .custom((value, { req }) => {
      if (value !== req.body.newPassword) {
        throw new Error('Passwords do not match');
      }
      return true;
    }),
];

/**
 * Validation rules for getting a user
 */
export const getUserValidation: ValidationChain[] = [
  query('id')
    .optional()
    .isUUID()
    .withMessage('Invalid user ID format'),
  
  query('email')
    .optional()
    .isEmail()
    .withMessage('Invalid email format'),
  
  query('phone')
    .optional()
    .isString()
    .withMessage('Phone must be a string'),
  
  query('includeDeleted')
    .optional()
    .isBoolean()
    .withMessage('includeDeleted must be a boolean'),
];

/**
 * Validation rules for deleting a user
 */
export const deleteUserValidation: ValidationChain[] = [
  param('userId')
    .notEmpty()
    .withMessage('User ID is required')
    .isUUID()
    .withMessage('Invalid user ID format'),
];
