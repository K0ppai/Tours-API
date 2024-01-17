import { NextFunction } from 'express';
import { Schema, model } from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcrypt';

const userSchema = new Schema({
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
    min: [8, 'A password should have at least 8 characters.'],
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
});

userSchema.pre('save', async function (next: NextFunction) {
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});

const User = model('User', userSchema);

export default User;
