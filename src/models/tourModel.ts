import { NextFunction } from 'express';
import { Model, model, Query, Schema } from 'mongoose';
import slugify from 'slugify';
import { ITour, ITourQuery } from 'types/index.js';

const tourSchema = new Schema<ITour, Model<ITour>, {}>(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name'],
      unique: true,
      maxlength: [
        40,
        'A tour name must have less than or equal to 40 characters',
      ],
      minlength: [
        10,
        'A tour name must have greater than or equal to 10 characters',
      ],
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
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'Difficulty must be either: easy, medium or difficult',
      },
    },
    price: {
      type: Number,
      required: [true, 'A tour must have a price'],
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must be below 5.0'],
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    priceDiscount: {
      type: Number,
      validate: {
        // only works on create or save
        validator: function (val: number) {
          return val < this.price;
        },
        message: 'Discount value ({VALUE}) must be lower than the price',
      },
    },
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
    startLocation: {
      type: {
        type: String,
        default: 'Point',
        enum: ['Point'],
      },
      coordinates: [Number],
      address: String,
      description: String,
    },
    locations: [
      {
        type: {
          type: String,
          default: 'Point',
          enum: ['Point'],
        },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number,
      },
    ],
    guides: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Improve read performance with indexes
tourSchema.index({ price: 1, ratingsAverage: -1 });
tourSchema.index({ slug: 1 });

// Virtuals will only be available when set to true in Model option
tourSchema.virtual('durationInWeek').get(function () {
  return this.duration / 7;
});

// Virtual child reviews for tour
tourSchema.virtual('reviews', {
  ref: 'Review',
  localField: '_id',
  foreignField: 'tour',
});

//  Middleware before the save()/create() event
tourSchema.pre('save', function (next: NextFunction) {
  console.log('Document about to be saved');
  this.slug = slugify(this.name, {
    lower: true,
  });
  next();
});

// Embedding
// tourSchema.pre('save', async function (next) {
//   const guidesPromises = this.guides.map(async (id) => await User.findById(id));
//   this.guides = await Promise.all(guidesPromises);
//   next();
// });

//  Middleware only works for the save()/create() events
tourSchema.post('save', function (doc: ITour, next: NextFunction) {
  console.log('Document Saved');
  console.log(doc);
  next();
});

// QUERY MIDDLEWARE
tourSchema.pre(/^find/, function (this: ITourQuery, next: NextFunction) {
  this.find({
    secretTour: {
      $ne: true,
    },
  });
  this.startTime = Date.now();
  next();
});

tourSchema.pre(/^find/, function (this: ITourQuery, next) {
  this.populate({
    path: 'guides',
    select: '-passwordChangedAt -__v',
  });
  next();
});

tourSchema.post(/^find/, function (this: ITourQuery, _doc, next: NextFunction) {
  console.log(`Query took ${Date.now() - this.startTime}`);
  next();
});

// Aggregation Middleware
tourSchema.pre('aggregate', function (next: NextFunction) {
  this.pipeline().unshift({
    $match: {
      secretTour: {
        $ne: true,
      },
    },
  });

  next();
});

const Tour = model<ITour>('Tour', tourSchema);

export default Tour;
