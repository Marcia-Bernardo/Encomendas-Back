import mongoose from "mongoose";
import { v1 } from "uuid";
const Schema = mongoose.Schema;

const itemSchema = new Schema(
  {
    _id: { type: String, default: v1 },
    qtd: {
      type: Number,
      required: true,
    },
    type: { type: String, required: true },
    confetionTime: {
      type: Number,
      required: true,
    },
    created_at: { type: Date, default: Date.now() },
    updated_at: { type: Date, default: Date.now() },
  },
  {
    toJSON: {
      transform(doc, ret) {
        delete ret.__v;
      },
    },
  }
);
const itemModel = mongoose.model("Item", itemSchema);

export default itemModel;
