import { Model, Query, Schema, model } from 'mongoose';
import { IReview } from 'types';

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

reviewSchema.pre(/^find/, function (this: Query<IReview[], IReview>, next) {
  this.populate({
    path: 'user',
    select: 'name',
  });

  next();
});

const Review = model<IReview>('Review', reviewSchema);

export default Review;
