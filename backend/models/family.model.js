import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    name: {
      type: String,
    },
    relation: {
      type: String,
    },
  },
  { timestamps: true }
);

export const familyModel = mongoose.model("Family", schema);
