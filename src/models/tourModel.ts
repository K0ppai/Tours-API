import { NextFunction } from 'express';
import { model, Schema } from 'mongoose';
import slugify from 'slugify';
import { TTour, TourModelType } from 'types';

const tourSchema = new Schema<TTour, TourModelType, {}>(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name'],
      unique: true,
    },
    slug: String,
    duration: {
      type: Number,
      required: [true, 'A tour must have a duration'],
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have a group size'],
    },
    difficulty: {
      type: String,
      required: [true, 'A tour must have a difficulty'],
    },
    price: {
      type: Number,
      required: [true, 'A tour must have a price'],
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    priceDiscount: Number,
    summary: {
      type: String,
      trum: true,
      required: [true, 'A tour must have a summary'],
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      required: [true, 'A tour must have a cover image'],
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    startDates: [Date],
    secretTour: { type: Boolean, default: false },
  },
  {
    toJSON: { virtuals: true },
    // toObject: { virtuals: true },
  }
);

// Virtuals will only be available when set to true in Model option
tourSchema.virtual('durationInWeek').get(function () {
  return this.duration / 7;
});

//  Middleware before the save()/create() event
tourSchema.pre('save', function (next: NextFunction) {
  console.log('Document about to be saved');
  this.slug = slugify(this.name, {
    lower: true,
  });
  next();
});

//  Middleware after the save()/create() event
tourSchema.post('save', function (doc, next: NextFunction) {
  console.log('Document Saved');
  console.log(doc);
  next();
});

// QUERY MIDDLEWARE
tourSchema.pre(/^find/, function (this: TourModelType, next: NextFunction) {
  this.find({
    secretTour: {
      $ne: true,
    },
  });
  this.startTime = Date.now();
  next();
});

tourSchema.post(
  /^find/,
  function (this: TourModelType, _doc, next: NextFunction): void {
    console.log(`Query took ${Date.now() - this.startTime}`);
    next();
  }
);

const Tour = model<TTour>('Tour', tourSchema);

export default Tour;
