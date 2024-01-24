import { NextFunction } from 'express';
import { Model, Schema, model } from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { IUserMethods, IUser } from 'types';

const userSchema = new Schema<IUser, Model<IUser>, IUserMethods>({
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
  role: {
    type: String,
    default: 'user',
    enum: {
      values: ['user', 'guide', 'lead-guide', 'admin'],
    },
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
  passwordResetToken: String,
  passwordResetExpiredAt: Date,
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
});

// MIDDLEWARE
userSchema.pre('save', async function (next: NextFunction) {
  // only run on save event where password is modified, ie doesn't run on save event where name or other paths is changed
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});

userSchema.pre('save', function (next) {
  if (!this.isModified('password') || this.isNew) return next();

  // -1000 in case passwordChangedAt might be later than the created token which will be used to compare in authentication changePasswordAfter
  this.passwordChangedAt = new Date(Date.now() - 1000);
  next();
});

userSchema.pre(/^find/, async function (this: Model<IUser>, next) {
  this.find({
    active: {
      $ne: false,
    },
  });

  next();
});

// INSTANCE METHODS
userSchema.methods.correctPassword = async function (
  loginPassword: string,
  userPassword: string
): Promise<boolean> {
  return await bcrypt.compare(loginPassword, userPassword);
};

userSchema.methods.changePasswordAfter = function (
  this: IUser,
  JWTTimeStamp: number
) {
  // get time turn date into milliseconds because JWTTimeStamp is in seconds
  const passwordChangeTime = this.passwordChangedAt.getTime() / 1000;

  return JWTTimeStamp < passwordChangeTime;
};

userSchema.methods.createResetPasswordToken = function (this: IUser) {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  // date in millisec + 10 * 1000(to change into sec) * 60(change into min)
  this.passwordResetExpiredAt = new Date(Date.now() + 10 * 1000 * 60);

  return resetToken;
};

const User = model('User', userSchema);

export default User;
