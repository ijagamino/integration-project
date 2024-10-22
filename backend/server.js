const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose
  .connect("mongodb://localhost:27017/clinic", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Could not connect to MongoDB:", err));

// Define the Product schema and model
const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
  stock: Number,
});

const Product = mongoose.model("Product", productSchema);

app.get("/api/products", async (req, res) => {
  try {
    const products = await Product.find({}, "name price stock");
    console.log("Fetched products:", products);
    res.json(products);
  } catch (error) {
    console.error("Failed to fetch products:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Add a new product
app.post("/api/products", async (req, res) => {
  try {
    const newProduct = new Product(req.body);
    await newProduct.save();
    res.json(newProduct);
  } catch (error) {
    console.error("Failed to add product:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Update an existing product
app.put("/api/products/:id", async (req, res) => {
  const { id } = req.params;
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

    res.json(updatedProduct);
  } catch (error) {
    console.error("Failed to update product:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
