import mongoose from 'mongoose';

const ProductReviewSchema = new mongoose.Schema(
  {
    productId: String,
    userId: String,
    userName: String,
    reviewMessage: String,
    reviewValue: Number,
  },
  { timestamps: true }
);

export default mongoose.model('ProductReview', ProductReviewSchema);
