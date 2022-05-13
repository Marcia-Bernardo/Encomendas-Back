import mongoose from "mongoose";
import { v1 } from "uuid";
const Schema = mongoose.Schema;

const itemTypeSchema = new Schema(
  {
    _id: { type: String, default: v1 },
    type: { type: String, required: true },
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
const itemTypeModel = mongoose.model("ItemType", itemTypeSchema);

export default itemTypeModel;
