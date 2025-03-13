import { body, param, query, ValidationChain } from 'express-validator';
import { regionRepository } from '../repositories/RegionRepository';
import { neighborhoodRepository } from '../repositories/NeighborhoodRepository';
import { teamRepository } from '../repositories/TeamRepository';
import { memberRepository } from '../repositories/MemberRepository';
import { teamTypeEnum } from '../db/schema';

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

/**
 * Validation rules for creating a neighborhood
 */
export const createNeighborhoodValidation: ValidationChain[] = [
  body('name')
    .notEmpty()
    .withMessage('Name is required')
    .isString()
    .withMessage('Name must be a string')
    .isLength({ max: 100 })
    .withMessage('Name must be at most 100 characters'),
  
  body('city')
    .notEmpty()
    .withMessage('City is required')
    .isString()
    .withMessage('City must be a string')
    .isLength({ max: 100 })
    .withMessage('City must be at most 100 characters'),
];

/**
 * Validation rules for creating multiple neighborhoods in batch
 */
export const createBatchNeighborhoodValidation: ValidationChain[] = [
  body('city')
    .notEmpty()
    .withMessage('City is required')
    .isString()
    .withMessage('City must be a string')
    .isLength({ max: 100 })
    .withMessage('City must be at most 100 characters'),
  
  body('neighborhoods')
    .notEmpty()
    .withMessage('Neighborhoods are required')
    .isArray()
    .withMessage('Neighborhoods must be an array')
    .custom((value) => {
      if (!Array.isArray(value) || value.length === 0) {
        throw new Error('Neighborhoods array must not be empty');
      }
      
      for (const name of value) {
        if (typeof name !== 'string' || name.trim() === '') {
          throw new Error('All neighborhood names must be non-empty strings');
        }
        
        if (name.length > 100) {
          throw new Error('Neighborhood names must be at most 100 characters');
        }
      }
      
      return true;
    }),
];

/**
 * Validation rules for updating a neighborhood
 */
export const updateNeighborhoodValidation: ValidationChain[] = [
  param('id')
    .notEmpty()
    .withMessage('Neighborhood ID is required')
    .isUUID()
    .withMessage('Invalid neighborhood ID format'),
  
  body('name')
    .optional()
    .isString()
    .withMessage('Name must be a string')
    .isLength({ max: 100 })
    .withMessage('Name must be at most 100 characters'),
  
  body('city')
    .optional()
    .isString()
    .withMessage('City must be a string')
    .isLength({ max: 100 })
    .withMessage('City must be at most 100 characters'),
];

/**
 * Validation rules for creating a region
 */
export const createRegionValidation: ValidationChain[] = [
  body('name')
    .notEmpty()
    .withMessage('Name is required')
    .isString()
    .withMessage('Name must be a string')
    .isLength({ max: 100 })
    .withMessage('Name must be at most 100 characters'),
  
  body('neighborhood_ids')
    .optional()
    .isArray()
    .withMessage('Neighborhood IDs must be an array')
    .custom(async (value) => {
      if (Array.isArray(value) && value.length > 0) {
        for (const id of value) {
          if (typeof id !== 'string' || !id.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)) {
            throw new Error('All neighborhood IDs must be valid UUIDs');
          }
        }
      }
      
      return true;
    }),
];

/**
 * Validation rules for updating a region
 */
export const updateRegionValidation: ValidationChain[] = [
  param('id')
    .notEmpty()
    .withMessage('Region ID is required')
    .isUUID()
    .withMessage('Invalid region ID format'),
  
  body('name')
    .optional()
    .isString()
    .withMessage('Name must be a string')
    .isLength({ max: 100 })
    .withMessage('Name must be at most 100 characters'),
];

/**
 * Validation rules for updating region neighborhoods
 */
export const updateRegionNeighborhoodsValidation: ValidationChain[] = [
  param('id')
    .notEmpty()
    .withMessage('Region ID is required')
    .isUUID()
    .withMessage('Invalid region ID format'),
  
  body('neighborhood_ids')
    .notEmpty()
    .withMessage('Neighborhood IDs are required')
    .isArray()
    .withMessage('Neighborhood IDs must be an array')
    .custom(async (value) => {
      if (!Array.isArray(value)) {
        throw new Error('Neighborhood IDs must be an array');
      }
      
      for (const id of value) {
        if (typeof id !== 'string' || !id.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)) {
          throw new Error('All neighborhood IDs must be valid UUIDs');
        }
      }
      
      return true;
    }),
];

/**
 * Validation rules for adding neighborhoods to a region
 */
export const addRegionNeighborhoodsValidation: ValidationChain[] = [
  param('id')
    .notEmpty()
    .withMessage('Region ID is required')
    .isUUID()
    .withMessage('Invalid region ID format'),
  
  body('neighborhood_ids')
    .notEmpty()
    .withMessage('Neighborhood IDs are required')
    .isArray()
    .withMessage('Neighborhood IDs must be an array')
    .custom(async (value) => {
      if (!Array.isArray(value) || value.length === 0) {
        throw new Error('Neighborhood IDs array must not be empty');
      }
      
      for (const id of value) {
        if (typeof id !== 'string' || !id.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)) {
          throw new Error('All neighborhood IDs must be valid UUIDs');
        }
      }
      
      return true;
    }),
];

/**
 * Validation rules for creating a team
 */
export const createTeamValidation: ValidationChain[] = [
  body('name')
    .notEmpty()
    .withMessage('Name is required')
    .isString()
    .withMessage('Name must be a string')
    .isLength({ max: 100 })
    .withMessage('Name must be at most 100 characters'),
  
  body('teamType')
    .notEmpty()
    .withMessage('Team type is required')
    .isString()
    .withMessage('Team type must be a string')
    .isIn(teamTypeEnum.enumValues)
    .withMessage(`Team type must be one of: ${teamTypeEnum.enumValues.join(', ')}`),
];

/**
 * Validation rules for updating a team
 */
export const updateTeamValidation: ValidationChain[] = [
  param('id')
    .notEmpty()
    .withMessage('Team ID is required')
    .isUUID()
    .withMessage('Invalid team ID format'),
  
  body('name')
    .optional()
    .isString()
    .withMessage('Name must be a string')
    .isLength({ max: 100 })
    .withMessage('Name must be at most 100 characters'),
  
  body('teamType')
    .optional()
    .isString()
    .withMessage('Team type must be a string')
    .isIn(teamTypeEnum.enumValues)
    .withMessage(`Team type must be one of: ${teamTypeEnum.enumValues.join(', ')}`),
];

/**
 * Validation rules for setting a team leader
 */
export const setTeamLeaderValidation: ValidationChain[] = [
  param('id')
    .notEmpty()
    .withMessage('Team ID is required')
    .isUUID()
    .withMessage('Invalid team ID format'),
  
  body('member_id')
    .notEmpty()
    .withMessage('Member ID is required')
    .isUUID()
    .withMessage('Invalid member ID format'),
];

/**
 * Validation rules for creating a member
 */
export const createMemberValidation: ValidationChain[] = [
  body('name')
    .notEmpty()
    .withMessage('Name is required')
    .isString()
    .withMessage('Name must be a string')
    .isLength({ max: 100 })
    .withMessage('Name must be at most 100 characters'),
  
  body('email')
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Invalid email format')
    .isLength({ max: 100 })
    .withMessage('Email must be at most 100 characters'),
  
  body('phone')
    .notEmpty()
    .withMessage('Phone is required')
    .isString()
    .withMessage('Phone must be a string')
    .isLength({ max: 20 })
    .withMessage('Phone must be at most 20 characters'),
  
  body('isLeader')
    .optional()
    .isBoolean()
    .withMessage('isLeader must be a boolean'),
  
  body('teamId')
    .notEmpty()
    .withMessage('Team ID is required')
    .isUUID()
    .withMessage('Invalid team ID format'),
];

/**
 * Validation rules for updating a member
 */
export const updateMemberValidation: ValidationChain[] = [
  param('id')
    .notEmpty()
    .withMessage('Member ID is required')
    .isUUID()
    .withMessage('Invalid member ID format'),
  
  body('name')
    .optional()
    .isString()
    .withMessage('Name must be a string')
    .isLength({ max: 100 })
    .withMessage('Name must be at most 100 characters'),
  
  body('email')
    .optional()
    .isEmail()
    .withMessage('Invalid email format')
    .isLength({ max: 100 })
    .withMessage('Email must be at most 100 characters'),
  
  body('phone')
    .optional()
    .isString()
    .withMessage('Phone must be a string')
    .isLength({ max: 20 })
    .withMessage('Phone must be at most 20 characters'),
  
  body('isLeader')
    .optional()
    .isBoolean()
    .withMessage('isLeader must be a boolean'),
  
  body('teamId')
    .optional()
    .isUUID()
    .withMessage('Invalid team ID format'),
];

/**
 * Validation rules for updating a member's status
 */
export const updateMemberStatusValidation: ValidationChain[] = [
  param('id')
    .notEmpty()
    .withMessage('Member ID is required')
    .isUUID()
    .withMessage('Invalid member ID format'),
  
  body('active')
    .notEmpty()
    .withMessage('Active status is required')
    .isBoolean()
    .withMessage('Active status must be a boolean'),
];
