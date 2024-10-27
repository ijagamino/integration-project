import { Schema, model } from "mongoose";

const salesDetailsSchema = new Schema({
  productID: {
    type: Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  saleID: {
    type: Schema.Types.ObjectId,
    ref: "Sales",
    required: true,
  },
  quantity: { type: Number, required: true },
  total: { type: Number, required: true },
});

export default model("SalesDetails", salesDetailsSchema);
