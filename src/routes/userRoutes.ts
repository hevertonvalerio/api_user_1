import { Router } from 'express';
import { userController } from '../controllers/UserController';
import { apiKeyMiddleware } from '../middlewares/ApiKeyMiddleware';
import { validationErrorHandler } from '../middlewares/ErrorHandlerMiddleware';
import {
  createUserValidation,
  updateUserValidation,
  changePasswordValidation,
  getUserValidation,
  deleteUserValidation,
} from '../utils/validateInput';

const router = Router();

// Create a new user
router.post(
  '/',
  apiKeyMiddleware as any,
  createUserValidation,
  validationErrorHandler as any,
  userController.createUser as any
);

// Update a user
router.put(
  '/:userId',
  apiKeyMiddleware as any,
  updateUserValidation,
  validationErrorHandler as any,
  userController.updateUser as any
);

// Change a user's password
router.patch(
  '/:userId/password',
  apiKeyMiddleware as any,
  changePasswordValidation,
  validationErrorHandler as any,
  userController.changePassword as any
);

// Soft delete a user
router.delete(
  '/:userId',
  apiKeyMiddleware as any,
  deleteUserValidation,
  validationErrorHandler as any,
  userController.softDeleteUser as any
);

// Get a user by query parameters
router.get(
  '/',
  apiKeyMiddleware as any,
  getUserValidation,
  validationErrorHandler as any,
  userController.getUserByQuery as any
);

export default router;
