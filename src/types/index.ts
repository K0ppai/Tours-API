export interface TourType {
  name: string;
  duration: number;
  maxGroupSize: number;
  difficulty: string;
  price: number;
  ratingsAverage: number;
  ratingsQuantity: number;
  summary: string;
  imageCover: string;
  images: string[];
  createdAt: Date;
  startDates: string[];
  priceDiscount?: number;
  description?: string;
}