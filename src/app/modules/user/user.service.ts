/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import { Secret } from 'jsonwebtoken';
import config from '../../../config';
import ApiError from '../../../errors/ApiError';
import { fileUploadHelper } from '../../../helpers/fileUploadHelper';
import { jwtHelpers } from '../../../helpers/jwtHelpers';
import { ICloudinaryResponse, IUploadFile } from '../../../interfaces/file';
import { IUser } from './user.interface';
import { User } from './user.model';

const getAllUsers = async (): Promise<IUser[] | []> => {
  const result = await User.find({ role: { $ne: 'admin' } });
  return result;
};

const getSingleUser = async (id: string): Promise<IUser | null> => {
  const result = await User.findOne({userId: id}).select('-password');
  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  return result;
};

const updateUser = async (
  id: string,
  payload: Partial<IUser>,
  file?: IUploadFile
): Promise<IUser | null> => {
  const isExist = await User.findOne({ _id: id });

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found !');
  }

  if (file) {
    const uploadedImg = (await fileUploadHelper.uploadToCloudinary(
      file
    )) as ICloudinaryResponse;
    // console.log(uploadedImg);
    payload.profileImg = uploadedImg.secure_url;
  }
  
  const result = await User.findOneAndUpdate({ _id: id }, payload, {
    new: true,
  }).select('-password');

  return result;
};

const deleteUser = async (id: string): Promise<IUser | null> => {
  const isExist = await User.findOne({ _id: id });
  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  const result = await User.findByIdAndDelete(id);
  return result;
};

const getMyProfile = async (token: string): Promise<IUser | null> => {
  const verifiedUser = jwtHelpers.verifyToken(
    token,
    config.jwt.secret as Secret
  );
  const result = await User.findById(verifiedUser._id);
  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  return result;
};

const updateMyProfile = async (
  token: string,
  payload: Partial<IUser>,
  file?: IUploadFile
): Promise<IUser | null> => {
  const verifiedUser = jwtHelpers.verifyToken(
    token,
    config.jwt.secret as Secret
  );

  // console.log(token, verifiedUser);

  const isExist = await User.findOne({ _id: verifiedUser._id });

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found !');
  }

  if (file) {
    const uploadedImg = (await fileUploadHelper.uploadToCloudinary(
      file
    )) as ICloudinaryResponse;
    // console.log(uploadedImg);
    payload.profileImg = uploadedImg.secure_url;
  }

  payload.isProfileUpdateRequested = true;
 
  const result = await User.findOneAndUpdate(
    { _id: verifiedUser._id },
    payload,
    {
      new: true,
    }
  ).select('-password');

  return result;
};

export const UserService = {
  getAllUsers,
  getSingleUser,
  updateUser,
  deleteUser,
  getMyProfile,
  updateMyProfile,
};
