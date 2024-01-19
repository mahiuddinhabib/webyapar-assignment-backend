/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-unused-vars */
import { Model } from 'mongoose';

export type IUserRole = 'user' | 'admin';

export type IUser = {
  userId: string;
  name: string;
  role: IUserRole;
  password: string;
  isProfileCompleted: boolean;
  isProfileUpdateRequested: boolean;
  profileImg: string;
};

export type UserModel = {
  isUserExist(
    userId: string
  ): Promise<
    (Pick<IUser, 'role' | 'userId' | 'password'> & { _id: any }) | null
  >;
  isPasswordMatched(
    givenPassword: string,
    savedPassword: string
  ): Promise<boolean>;
} & Model<IUser>;
