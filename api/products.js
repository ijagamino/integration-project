import mongoose from "mongoose";
import Product from "../backend/models/Product"; // Import the Product model

export default async function handler(req, res) {
  await mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  const { id } = req.query;

  if (req.method === "GET") {
    try {
      const products = await Product.find({});
      res.status(200).json(products);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch products" });
    }
  } else if (req.method === "POST") {
    try {
      const newProduct = new Product(req.body);
      const savedProduct = await newProduct.save();

      res.status(201).json(savedProduct);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  } else if (req.method === "PUT" && id) {
    const { name, price, stock } = req.body;

    try {
      const updatedProduct = await Product.findByIdAndUpdate(
        id,
        { name, price, stock },
        { new: true, runValidators: true }
      );

      if (!updatedProduct) {
        return res.status(404).json({ message: "Product not found" });
      }

      res.status(200).json(updatedProduct);
    } catch (error) {
      console.error("Failed to update product:", error);
      res.status(500).json({ message: "Server error" });
    }
  } else {
    res.setHeader("Allow", ["GET", "POST", "PUT"]);
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
