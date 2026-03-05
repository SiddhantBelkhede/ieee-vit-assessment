import mongoose from "mongoose";

const questionSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
      enum: ["mcq", "fill", "output"],
    },
    text: {
      type: String,
      required: true,
    },
    options: {
      type: [String],
      default: [],
    },
    answer: {
      type: String,
      required: true,
    },
    codeSnippet: {
      type: String,
      default: "",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("Question", questionSchema);
