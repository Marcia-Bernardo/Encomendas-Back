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
    date: { type: Date, required: true },
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
const orderModel = mongoose.model("Order", orderSchema);
export default orderModel;
