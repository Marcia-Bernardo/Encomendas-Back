import mongoose from "mongoose";
import { v1 } from "uuid";
import { Password } from "../lib/password.js";
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    _id: { type: String, default: v1 },
    password: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    permission: { type: String, default: "view", required: true },
    created_at: { type: Date, default: Date.now() },
    updated_at: { type: Date, default: Date.now() },
  },
  {
    toJSON: {
      transform(doc, ret) {
        delete ret.password;
        delete ret.__v;
      },
    },
  }
);

userSchema.pre("save", async function (done) {
  if (this.isModified("password")) {
    const hashed = await Password.toHash(this.get("password"));
    this.set("password", hashed);
  }
  done();
});
userSchema.statics.build = (attrs) => new userModel(attrs);
const userModel = mongoose.model("User", userSchema);

export default userModel;

