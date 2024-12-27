import mongoose from "mongoose";

const FeatureSchema = new mongoose.Schema(
  {
    image: String,
  },
  { timestamps: true }
);

export default mongoose.model("Feature", FeatureSchema);
