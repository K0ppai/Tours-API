import { NextFunction } from 'express';
import { Model, Schema, model } from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcrypt';

interface TUser {
  name: string;
  email: string;
  photo: string;
  password: string;
  passwordConfirm: string;
  passwordChangedAt: Date;
}

type TCorrectPasswordFn = (
  loginPassword: string,
  userPassword: string
) => Promise<boolean>;

const userSchema = new Schema<
  TUser,
  Model<TUser>,
  {
    correctPassword: TCorrectPasswordFn;
    changePasswordAfter: (JWTTimeStamp: number) => boolean;
  }
>({
  name: {
    type: String,
    require: [true, 'Please provide your username.'],
  },
  email: {
    type: String,
    require: [true, 'Please provide your email address.'],
    unique: true,
    lowercase: true,
    validate: [
      validator.isEmail,
      '{VALUE} is not an email. Please enter an email address.',
    ],
  },
  photo: {
    type: String,
  },
  password: {
    type: String,
    require: [true, 'Please provide a password.'],
    minlength: [8, 'A password should have at least 8 characters.'],
    select: false,
  },
  passwordConfirm: {
    type: String,
    require: [true, 'Please confirm your password.'],
    validate: {
      // only works on create or save
      validator: function (password: string) {
        return this.password === password;
      },
      message: 'Passwords are not the same.',
    },
  },
  passwordChangedAt: {
    type: Date,
  },
});

userSchema.pre('save', async function (next: NextFunction) {
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});

userSchema.methods.correctPassword = async function (
  loginPassword: string,
  userPassword: string
): Promise<boolean> {
  return await bcrypt.compare(loginPassword, userPassword);
};

userSchema.methods.changePasswordAfter = function (JWTTimeStamp: number) {
  // get time turn date into milliseconds because JWTTimeStamp is in seconds
  const passwordChangeTime = this.passwordChangedAt.getTime() / 1000;
  
  return JWTTimeStamp < passwordChangeTime;
};

const User = model('User', userSchema);

export default User;
