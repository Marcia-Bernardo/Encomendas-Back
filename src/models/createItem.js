import mongoose from "mongoose";
import { v1 } from "uuid";
const Schema = mongoose.Schema;

const itemSchema = new Schema(
  {
    orderNumber: { type: Number, required: true },
    _id: { type: String, default: v1 },
    name: { type: String, required: true },
    confetionTime: {
      type: Number,
      required: true,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      },
    },
  }
);
const itemModel = mongoose.model("Item", itemSchema);

export default itemModel;
