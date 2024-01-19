import express, { NextFunction, Request, Response } from 'express';
import { USER_ROLE } from '../../../enums/user';
import auth from '../../middlewares/auth';
import { UserController } from './user.controller';
import { UserValidation } from './user.validation';
import { fileUploadHelper } from '../../../helpers/fileUploadHelper';
const router = express.Router();

router.get(
  '/my-profile',
  auth(USER_ROLE.USER, USER_ROLE.ADMIN),
  UserController.getMyProfile
);

router.patch(
  '/my-profile',
  auth(USER_ROLE.USER, USER_ROLE.ADMIN),
  fileUploadHelper.upload.single('profileImg'),

  (req: Request, res: Response, next: NextFunction) => {
    req.body = UserValidation.updateUserZodSchema.parse(
      JSON.parse(req.body.data)
    );
    return UserController.updateMyProfile(req, res, next);
  }
);

router.get('/', auth(USER_ROLE.ADMIN), UserController.getAllUsers);

router.get('/:id', auth(USER_ROLE.ADMIN), UserController.getSingleUser);

router.patch(
  '/:id',
  auth(USER_ROLE.ADMIN),
  fileUploadHelper.upload.single('profileImg'),

  (req: Request, res: Response, next: NextFunction) => {    
    req.body = UserValidation.updateUserZodSchema.parse(
      JSON.parse(req.body.data)
    );

    return UserController.updateUser(req, res, next);
  }
);
  
  router.delete('/:id', auth(USER_ROLE.ADMIN), UserController.deleteUser);
  
export const UserRoutes = router;
