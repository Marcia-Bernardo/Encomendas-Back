import mongoose from "mongoose";
import { v1 } from "uuid";

const Schema = mongoose.Schema;

const orderSchema = new Schema(
  {
    _id: { type: String, default: v1 },
    items: [
      {
        type: String,
        ref: "Item",
      },
    ],
    obs: { type: String, required: true },
    name: { type: String, required: true },
    data: { type: Number, required: true },
    hour: { type: Number, required: true },
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
const orderModel = mongoose.model("Order", orderSchema);
export default orderModel;
