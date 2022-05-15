import mongoose from "mongoose";
import { v1 } from "uuid";
const Schema = mongoose.Schema;

const orderLineSchema = new Schema(
  {
    _id: { type: String, default: v1 },
    qtd: {
      type: Number,
      required: true,
    },
    item: { type: String, required: true },
    created_at: { type: Date, default: Date.now() },
    updated_at: { type: Date, default: Date.now() },
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
const orderLineModel = mongoose.model("OrderLine", orderLineSchema);

export default orderLineModel;
