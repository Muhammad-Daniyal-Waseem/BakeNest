const express = require("express");
const router = express.Router();
const connection = require("../database");
const multer = require("multer");
const path = require("path");

// Set up multer for handling file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Resolve the destination path relative to the location of this script
    const destinationPath = path.resolve(
      __dirname,
      "../../frontend/public/images/"
    );
    cb(null, destinationPath); // Save images in the public/images folder
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname); // Generate unique filenames
  },
});

const upload = multer({ storage: storage });

router.post("/addproduct", upload.single("image"), function (req, res) {
  const sql =
    "INSERT INTO Product (Name, Price, Description, Image) VALUES (?, ?, ?, ?)";
  const values = [
    req.body.pname,
    req.body.price,
    req.body.pdesc,
    "/images/" + req.file.filename, // Get the filename of the uploaded image
  ];

  connection.query(sql, values, (err, result) => {
    if (err) {
      console.error("Error adding product:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
    const newProduct = {
      ID: result.insertId,
      Name: req.body.pname,
      Price: req.body.price,
      Description: req.body.pdesc,
      Image: req.file.filename,
    };
    return res
      .status(200)
      .json({ message: "Product added successfully", product: newProduct });
  });
});

router.post("/updateproduct", upload.single("image"), function (req, res) {
  const { productId, pname, price, pdesc } = req.body;

  let sql;
  let values;

  if (req.file) {
    const imageValues = "/images/" + req.file.filename;
    sql = `UPDATE Product SET Name = ?, Price = ?, Description = ?, Image = ? WHERE ID = ?`;
    values = [pname, price, pdesc, imageValues, productId];
  } else {
    sql = `UPDATE Product SET Name = ?, Price = ?, Description = ? WHERE ID = ?`;
    values = [pname, price, pdesc, productId];
  }

  connection.query(sql, values, (err, result) => {
    if (err) {
      console.error("Error updating product:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
    const newProduct = {
      ID: productId,
      Name: pname,
      Price: price,
      Description: pdesc,
      Image: req.file ? "/images/" + req.file.filename : null, // Set image only if uploaded
    };
    return res
      .status(200)
      .json({ message: "Product updated successfully", product: newProduct });
  });
});

router.get("/allProducts", function (req, res) {
  const sql = "SELECT * FROM Product";
  connection.query(sql, (err, products) => {
    if (err) {
      console.error("Error fetching products:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
    return res.status(200).json(products);
  });
});

router.delete("/deleteProduct/:id", function (req, res) {
  const productId = req.params.id;
  const sql = "DELETE FROM Product WHERE ID = ?";

  connection.query(sql, [productId], (err, result) => {
    if (err) {
      console.error("Error deleting product:", err);

      return res.status(500).json({ error: "Internal server error" });
    }
    return res
      .status(200)
      .json({ message: "Product deleted successfully", productId });
  });
});

module.exports = router;
