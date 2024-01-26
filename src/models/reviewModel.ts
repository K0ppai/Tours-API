import { Model, Schema, model } from 'mongoose';
import { IReview, IReviewQuery } from 'types';
import Tour from './tourModel';

const reviewSchema = new Schema<IReview, Model<IReview>>(
  {
    review: {
      type: String,
      require: [true, 'Review cannot be empty!'],
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    tour: {
      type: Schema.Types.ObjectId,
      ref: 'Tour',
      required: [true, 'Review must belong to a tour.'],
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Review must belong to a user.'],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

reviewSchema.statics.calcAverageRating = async function (
  this: Model<IReview>,
  tourId: Schema.Types.ObjectId
) {
  // In static methods, this point to the model.
  const stats = await this.aggregate([
    {
      $match: { tour: tourId },
    },
    {
      $group: {
        _id: '$tour',
        nRating: { $sum: 1 },
        avgRating: { $avg: '$rating' },
      },
    },
  ]);

  if (stats.length > 0) {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsAverage: stats[0].avgRating,
      ratingsQuantity: stats[0].nRating,
    });
  } else {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsAverage: 4.5,
      ratingsQuantity: 0,
    });
  }
};

// each combination of tour and user will be unique. ie: a user can only give one review to a tour.
reviewSchema.index({ tour: 1, user: 1 }, { unique: true });

// Query Middlewares
reviewSchema.pre(/^find/, function (this: IReviewQuery, next) {
  this.populate({
    path: 'user',
    select: 'name',
  });

  next();
});

// Middleware to pass the current review to the post middleware to get the tourId
reviewSchema.pre(/^findOneAnd/, async function (this: IReviewQuery, next) {
  // Pass the current modified review
  this.review = await this.model.findOne(this.getQuery());
  next();
});

// After query this is an Document
reviewSchema.post(/^findOneAnd/, function (this: IReviewQuery) {
  // this.review = doc
  this.review.constructor.calcAverageRating(this.review.tour);
});

//  Middleware before the save()/create() event
reviewSchema.post('save', function (this: IReview) {
  // this = document, this.constructor = Model
  this.constructor.calcAverageRating(this.tour);
});

const Review = model<IReview>('Review', reviewSchema);

export default Review;
