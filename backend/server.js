const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

mongoose
  .connect("mongodb://localhost:27017/clinic", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Could not connect to MongoDB:", err));

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  stock: { type: Number, required: true },
});

const Product = mongoose.model("Product", productSchema);

const salesSchema = new mongoose.Schema({
  date: { type: Date, default: Date.now },
  totalAmount: { type: Number, required: true },
});

const Sales = mongoose.model("Sales", salesSchema);

const salesDetailsSchema = new mongoose.Schema({
  productID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  saleID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Sales",
    required: true,
  },
  quantity: { type: Number, required: true },
  total: { type: Number, required: true },
});

const SalesDetails = mongoose.model("SalesDetails", salesDetailsSchema);

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

app.post("/api/sales", async (req, res) => {
  try {
    const { totalAmount } = req.body;
    const newSale = new Sales({ totalAmount });
    await newSale.save();
    res.json(newSale);
  } catch (error) {
    console.error("Failed to create sale:", error);
    res.status(500).json({ message: "Server error" });
  }
});

app.post("/api/salesdetails", async (req, res) => {
  try {
    const { productID, saleID, quantity, total } = req.body;
    const newSalesDetail = new SalesDetails({
      productID,
      saleID,
      quantity,
      total,
    });
    await newSalesDetail.save();

    await Product.findByIdAndUpdate(productID, {
      $inc: { stock: -quantity },
    });

    res.json(newSalesDetail);
  } catch (error) {
    console.error("Failed to add sales details:", error);
    res.status(500).json({ message: "Server error" });
  }
});

app.get("/api/salesdetails", async (req, res) => {
  try {
    const salesDetails = await SalesDetails.find({})
      .populate("productID", "name price")
      .populate("saleID", "date totalAmount");

    if (!salesDetails.length) {
      return res.status(404).json({ message: "No sales details found." });
    }

    const formattedSalesDetails = salesDetails.map((detail) => ({
      id: detail._id,
      salesID: detail.saleID._id,
      productName: detail.productID.name,
      quantity: detail.quantity,
      total: detail.total,
      date: detail.saleID.date.toLocaleDateString("en-US"),
      totalAmount: detail.saleID.totalAmount,
    }));

    res.json(formattedSalesDetails);
  } catch (error) {
    console.error("Failed to fetch sales details:", error);
    res.status(500).json({ message: "Server error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
