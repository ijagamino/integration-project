import mongoose from "mongoose";
import SalesDetails from "../backend/models/SalesDetails";
import Product from "../backend/models/Product";
import Sales from "../backend/models/Sales";

export default async function handle(req, res) {
  await mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  if (req.method === "GET") {
    try {
      const salesDetails = await SalesDetails.find({}).lean();

      const formattedSalesDetails = await Promise.all(
        salesDetails.map(async (detail) => {
          const product = await Product.findById(detail.productID).lean();
          const sale = await Sales.findById(detail.saleID).lean();
          return {
            id: detail._id,
            saleID: sale ? sale._id : null,
            productID: product ? product._id : null,
            productName: product ? product.name : null,
            quantity: detail.quantity,
            total: detail.total,
            date: sale ? sale.date.toLocaleDateString("en-US") : null,
            totalAmount: sale ? sale.totalAmount : null,
          };
        })
      );

      res.status(200).json(formattedSalesDetails);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch sales details" });
    }
  } else if (req.method === "POST") {
    try {
      const { productID, saleID, quantity, total } = req.body;
      const newSaleDetail = new SalesDetails({
        productID,
        saleID,
        quantity,
        total,
      });

      await newSaleDetail.save();

      await Product.findByIdAndUpdate(productID, {
        $inc: { stock: -quantity },
      });

      res.status(201).json(newSaleDetail);
    } catch (error) {
      res.status(500).json({ error: "Failed to add sales detail" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
