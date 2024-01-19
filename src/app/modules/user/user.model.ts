import bcrypt from 'bcrypt';
import { Schema, model } from 'mongoose';
import config from '../../../config';
import { userRole } from './user.constant';
import { IUser, UserModel } from './user.interface';

export const UserSchema = new Schema<IUser, UserModel>(
  {
    userId: {
      type: String,
      unique: true,
      required: true,
    },
    name: String,
    role: {
      type: String,
      enum: userRole,
      default: 'user',
    },
    password: {
      type: String,
      required: true,
      select: 0,
    },
    isProfileCompleted: {
      type: Boolean,
      default: false,
    },
    isProfileUpdateRequested: {
      type: Boolean,
      default: false,
    },
    profileImg: String,
  },
  {
    timestamps: true,
  }
);

UserSchema.statics.isUserExist = async function (
  userId: string
): Promise<
  (Pick<IUser, 'role' | 'userId' | 'password'> & { _id: any }) | null
> {
  return await User.findOne(
    { userId },
    { _id: 1, role: 1, userId: 1, password: 1 }
  );
};

UserSchema.statics.isPasswordMatched = async function (
  givenPassword: string,
  savedPassword: string
): Promise<boolean> {
  return await bcrypt.compare(givenPassword, savedPassword);
};

UserSchema.pre('save', async function (next) {
  // const admin = this;
  this.password = await bcrypt.hash(
    this.password,
    Number(config.bcrypt_salt_rounds)
  );
  next();
});

export const User = model<IUser, UserModel>('User', UserSchema);
