import { Request } from 'express';
import { Model, Types } from 'mongoose';

// Tour Types
interface IStartLocation {
  type: string;
  coordinates: number[];
  address: string;
  description: string;
  day: number;
}
export interface ITour {
  name: string;
  duration: number;
  maxGroupSize: number;
  difficulty: string;
  price: number;
  ratingsAverage: number;
  ratingsQuantity: number;
  summary: string;
  imageCover: string;
  images: Types.Array<string>;
  createdAt: Date;
  startDates: Types.Array<string>;
  priceDiscount?: number;
  description?: string;
  secretTour: Boolean;
  slug: string;
  startLocation: IStartLocation;
  locations: IStartLocation[];
  guides: IUser[];
}

export interface TourModelType extends Model<ITour> {
  startTime: number;
}

// User Types
export interface IUser {
  name: string;
  email: string;
  role: string;
  photo: string;
  password: string;
  passwordConfirm: string;
  passwordChangedAt: Date;
  passwordResetExpiredAt: Date;
  passwordResetToken: string;
  _id: Types.ObjectId;
  id: Types.ObjectId;
  active: boolean;
}

export interface IUserMethods {
  correctPassword: (
    loginPassword: string,
    userPassword: string
  ) => Promise<boolean>;
  changePasswordAfter: (JWTTimeStamp: number) => boolean;
  createResetPasswordToken: () => string;
}

// Review Types
export interface IReview {
  review: string;
  rating: number;
  createdAt: Date;
  tour: ITour;
  user: IUser;
}

// Types related to requests
export interface IProtectRequest extends Request {
  user: IUser;
}

export interface IReqQuery {
  sort?: string;
  fields?: string;
  page?: string;
  limit?: string;
}

export interface IErrorHandler extends Error {
  statusCode?: number;
  status?: string;
  isOperational: boolean;
  path?: string;
  value?: string;
  keyValue?: {
    name: string;
  };
  errors: object;
}
