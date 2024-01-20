import { Request } from 'express';
import { Model, Types } from 'mongoose';

export interface TTour {
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
}

export interface TourModelType extends Model<TTour> {
  startTime: number;
}

export interface TReqQuery {
  sort?: string;
  fields?: string;
  page?: string;
  limit?: string;
}

export interface TErrorHandler extends Error {
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
export interface TUser {
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
}
export interface TProtectRequest extends Request {
  user: TUser;
}
