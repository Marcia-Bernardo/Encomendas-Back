import mongoose from "mongoose";
import { v1 } from "uuid";

const Schema = mongoose.Schema;

const orderSchema = new Schema(
  {
    _id: { type: String, default: v1 },
    items: [
      {
        item: { type: String },
        qtd: { type: String },
        isPreparing: { type: Boolean, default: false },
      },
    ],
    obs: { type: String },
    name: { type: String, required: true },
    date: { type: Date, required: true },
    status: { type: Number, default: 0 },
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
