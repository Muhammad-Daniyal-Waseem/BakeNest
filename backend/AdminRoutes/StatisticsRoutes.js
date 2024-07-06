const express = require("express");
const router = express.Router();
const connection = require("../database");

router.get("/getOrders", async (req, res) => {
  try {
    // Construct the SQL query to retrieve orders and product details based on userId
    const ordersQuery = `
          SELECT o.*, u.Name AS customerName, p.Name AS productName, p.Price, p.Rating 
          FROM Orders o 
          JOIN Product p on o.ProductId = p.ID 
          JOIN User u on u.ID = o.CustomerId
          ORDER BY o.Date DESC
        `;

    // Execute the SQL query with dynamic conditions
    connection.query(ordersQuery, (err, orders) => {
      if (err) {
        console.error("Error retrieving orders:", err);
        return res.status(500).json({ error: "Error retrieving orders" });
      }

      return res.status(200).json({ orders });
    });
  } catch (error) {
    console.error("Error retrieving current orders:", error);
    return res.status(500).json({ error: "Error retrieving current orders" });
  }
});


router.post("/getOrdersByCustomerID", async (req, res) => {
  const { customerId } = req.body;
  try {
    // Construct the SQL query to retrieve orders and product details based on userId
    const ordersQuery = `
        SELECT o.*, u.Name AS customerName, p.Name AS productName, p.Price, p.Rating 
        FROM Orders o 
        JOIN Product p on o.ProductId = p.ID 
        JOIN User u on u.ID = o.CustomerId 
        WHERE o.Status = 'completed'
        AND
        o.CustomerId = ?
        ORDER BY o.Date DESC
      `;

    // Execute the SQL query with dynamic conditions
    connection.query(ordersQuery, [customerId], (err, orders) => {
      if (err) {
        console.error("Error retrieving orders:", err);
        return res.status(500).json({ error: "Error retrieving orders" });
      }

      return res.status(200).json({ orders });
    });
  } catch (error) {
    console.error("Error retrieving current orders:", error);
    return res.status(500).json({ error: "Error retrieving current orders" });
  }
});

router.post("/getOrdersByProductID", async (req, res) => {
  const { productId } = req.body;
  try {
    // Construct the SQL query to retrieve orders and product details based on userId
    const ordersQuery = `
          SELECT o.*, u.Name AS customerName, p.Name AS productName, p.Price, p.Rating 
          FROM Orders o 
          JOIN Product p on o.ProductId = p.ID 
          JOIN User u on u.ID = o.CustomerId 
          WHERE o.Status = 'completed'
          AND
          o.ProductId = ?
          ORDER BY o.Date DESC
        `;

    // Execute the SQL query with dynamic conditions
    connection.query(ordersQuery, [productId], (err, orders) => {
      if (err) {
        console.error("Error retrieving orders:", err);
        return res.status(500).json({ error: "Error retrieving orders" });
      }

      return res.status(200).json({ orders });
    });
  } catch (error) {
    console.error("Error retrieving current orders:", error);
    return res.status(500).json({ error: "Error retrieving current orders" });
  }
});

router.get("/getProducts", function (req, res) {
  const sql = "SELECT * FROM Product";
  connection.query(sql, (err, products) => {
    if (err) {
      console.error("Error fetching products:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
    return res.status(200).json({ products });
  });
});

router.get("/getCustomers", function (req, res) {
  const sql = "SELECT * FROM User WHERE Admin = False";
  connection.query(sql, (err, customers) => {
    if (err) {
      console.error("Error fetching products:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
    return res.status(200).json({ customers });
  });
});

router.post("/getProductStats", function (req, res) {
  const { productId } = req.body;
  const sql =
    "SELECT ProductId, SUM(TotalBill) AS TotalRevnue, SUM(Quantity) As TotalItemsSold from Orders WHERE ProductId = ? AND Status = 'completed' Group By ProductId;";
  connection.query(sql, [productId], (err, stats) => {
    if (err) {
      return res.status(500).json({ error: "Internal server error" });
    }
    return res.status(200).json({ stats });
  });
});

module.exports = router;
