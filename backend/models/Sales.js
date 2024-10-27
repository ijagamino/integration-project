import { Schema, model } from "mongoose";

const salesSchema = new Schema({
  date: { type: Date, default: Date.now },
  totalAmount: { type: Number, required: true },
});

export default model("Sales", salesSchema);
