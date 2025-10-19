import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      unique: true,
    },
    title: {
      type: String,
    },
    testName: {
      type: String,
    },
     lab: {
      type: String,
    },
     doctor: {
      type: String,
    },
     date: {
      type: String,
    },
    price: {
        type:Number
    }

  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);
