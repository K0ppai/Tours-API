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
