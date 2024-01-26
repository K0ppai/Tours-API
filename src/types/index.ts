import { Request } from 'express';
import { Document, Query, Schema } from 'mongoose';
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

export interface ITourQuery extends Query<ITour[], ITour> {
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
  id: string;
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
export interface IReview extends Document {
  review: string;
  rating: number;
  createdAt: Date;
  tour: Schema.Types.ObjectId;
  user: Schema.Types.ObjectId;
  constructor: {
    calcAverageRating(tourId: Schema.Types.ObjectId): Promise<void>;
  };
}

export interface IReviewQuery extends Query<IReview[], IReview> {
  review: IReview;
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
