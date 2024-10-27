import mongoose from "mongoose";
import Sales from "../backend/models/Sales"; // Import the Product model

export default async function handler(req, res) {
  await mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  if (req.method === "GET") {
    try {
      const sales = await Sales.find({}, "totalAmount date");
      res.status(200).json(sales);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch sales" });
    }
  } else if (req.method === "POST") {
    try {
      const { totalAmount } = req.body;
      const newSale = new Sales({ totalAmount });
      await newSale.save();
      res.status(201).json(newSale);
    } catch (error) {
      res.status(500).json({ error: "Failed to create sale" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
