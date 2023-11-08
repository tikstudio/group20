import { Router } from 'express';
import UsersController from '../controllers/UsersController';
import validate from '../middlewares/validate';
import usersSchema from '../schema/usersSchema';

const router = Router();

router.post(
  '/login',
  validate(usersSchema.login),
  UsersController.login,
);

router.post(
  '/register',
  validate(usersSchema.register),
  UsersController.register,
);

router.get(
  '/list',
  validate(usersSchema.list, 'query'),
  UsersController.list,
);

router.get(
  '/profile',
  UsersController.profile,
);

router.get(
  '/single/:userId',
  UsersController.profile,
);

export default router;
