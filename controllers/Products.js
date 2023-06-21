const Product = require("../models/Product");

const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

const getProductById = async (req, res) => {
  try {
    const { productId } = req.params;
    console.log("productId", req);
    const product = await Product.findById(productId);

    if (!product) {
      return res
        .status(404)
        .json({ error: "Product not found", pid: productId });
    }
    res.status(200).json(product);
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ message: "Internal server error", error });
  }
};

const addProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      images,
      category,
      brand,
      material,
      size,
      color,
      reviews,
      mrp,
    } = req.body;
    const product = new Product({
      name,
      description,
      price,
      images,
      category,
      brand,
      material,
      size,
      color,
      reviews,
      mrp,
    });
    await product.save();
    res.status(201).json({ message: "Product added successfully", product });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error", error });
  }
};

// Add Multiple products (accessible to Dealer and Admin)
const addMultipleProducts = async (req, res) => {
  try {
    const { products } = req.body;
    console.log(typeof products);
    if (!Array.isArray(products) || products.length === 0) {
      return res.status(400).json({
        error: "Invalid request body. Expected an array of products.",
      });
    }

    const createdProducts = await Product.create(products);

    res.status(201).json({
      message: "Products added successfully",
      products: createdProducts,
    });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

const editProduct = async (req, res) => {
  try {
    const { name, description, price } = req.body;
    const { productId } = req.params;
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    product.name = name || product.name;
    product.description = description || product.description;
    product.price = price || product.price;
    await product.save();
    console.log("product", product);
    res.json({ message: "Product updated successfully", product });
  } catch (error) {
    console.log("product", product);
    res.status(500).json({ error: "Internal server error" });
  }
};

const applyDiscount = async (req, res) => {
  try {
    const { productId } = req.params;
    const { percentDiscout, flatDiscount } = req.body;
    console.log("ss", flatDiscount, percentDiscout, productId);
    if (!percentDiscout & !flatDiscount) {
      return res.status(401).json({ error: "Provide some discount to apply" });
    }

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    // discount logic here
    if (percentDiscout) {
      //This line might help in not give discount max than 20%
      const maxDiscount = 20;
      const valueToDiscount = (product.mrp / 100) * percentDiscout;
      if (valueToDiscount <= (product.mrp / 100) * maxDiscount) {
        product.price = product.mrp - valueToDiscount;
        await product.save();
      }
    } else if (flatDiscount) {
      //This line might help in not give discount max than 20%
      const maxDiscount = (product.mrp / 100) * 20;
      if (flatDiscount <= maxDiscount) {
        product.price = product.mrp - flatDiscount;
        await product.save();
      }
    }
    res.json({ message: "Discount applied successfully", product });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  addProduct,
  editProduct,
  applyDiscount,
  addMultipleProducts,
};
