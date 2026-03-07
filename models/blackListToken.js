import mongoose from "mongoose";

const blackListTokenSchema = new mongoose.Schema(
  {
    token: {
      required: true,
      type: String,
    },
  },
  { timestamps: true },
);

const blackListedToken =
  mongoose.models.blackListedToken ||
  mongoose.model("blackListedToken", blackListTokenSchema);
export default blackListedToken;
