const connection = require("./database");
const express = require("express");
const app = express();
const router = express.Router();
const cors = require("cors");
const querystring = require("querystring");
const { check, validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const jwtSecret = require("./jwtSecret");

router.get("/getProducts", function (req, res) {
  const sql = "SELECT * FROM Product";
  connection.query(sql, (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Internal server error" });
    }
    return res.status(200).json({ products: result }); // Corrected response
  });
});

router.get("/search", function (req, res) {
  let query = req.query.q;
  let keywords = query.split(" ");

  keywords = keywords.map((keyword) => querystring.unescape(keyword));

  let sql = "SELECT * FROM Product WHERE ";
  keywords.forEach((keyword, index) => {
    if (index > 0) {
      sql += " OR ";
    }
    sql +=
      "Name LIKE '%" + keyword + "%' OR Description LIKE '%" + keyword + "%'";
  });

  connection.query(sql, (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Internal server error" });
    }
    return res.status(200).json({ product: result });
  });
});

router.post(
  "/signup",
  check("email", "Email Length Error").isEmail().isLength({ min: 5, max: 30 }),
  check("password", "Password Length 10 - 20").isLength({ min: 5, max: 15 }),
  async (req, res) => {
    try {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(req.body.password, salt);
      // for admin
      const sql =
        "INSERT INTO User(`Name`, `Email`, `Password`, `Address`, `Contact`,`Admin`) VALUES (?, ?, ?, ?, ?, 0)";
      const values = [
        req.body.name,
        req.body.email,
        hashedPassword,
        req.body.address,
        req.body.contact,
      ];

      connection.query(sql, values, (err) => {
        if (err) {
          console.error("Error during signup:", err);
          return res.status(500).json({ error: "Error during signup" });
        }

        const PayLoad = {
          user: {
            email: req.body.email,
          },
        };
        const expirationTime = Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60;
        // Sign the JWT token with the payload and expiration time
        const token = jwt.sign({ ...PayLoad, exp: expirationTime }, jwtSecret);

        return res
          .status(200)
          .json({ token, message: "User registered successfully" });
      });
    } catch (error) {
      console.error("Error during signup:", error);
      return res.status(500).json({ error: "Error during signup" });
    }
  }
);

router.post("/login", async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  const sql = "SELECT * FROM User WHERE Email = ?";
  connection.query(sql, [email], async (err, results) => {
    if (err) {
      console.error("Error during login:", err);
      return res.status(500).json({ error: "Error during login" });
    }

    if (results.length === 0) {
      return res.status(401).json({ error: "User not found" });
    }

    const user = results[0];

    try {
      const passwordMatch = await bcrypt.compare(password, user.Password);
      if (passwordMatch) {
        const PayLoad = {
          user: {
            email: email,
          },
        };

        const expirationTime = Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60;
        // Sign the JWT token with the payload and expiration time
        const token = jwt.sign({ ...PayLoad, exp: expirationTime }, jwtSecret);

        return res.status(200).json({ token, user });
      } else {
        return res.status(401).json({ error: "Invalid password" });
      }
    } catch (error) {
      console.error("Error during password comparison:", error);
      return res.status(500).json({ error: "Error during login" });
    }
  });
});

router.post("/getUser", async (req, res) => {
  const email = req.body.email;
  const sql = "SELECT * FROM User WHERE Email = ?";

  connection.query(sql, [email], async (err, results) => {
    if (err) {
      console.error("Error during login:", err);
      return res.status(500).json({ error: "Error during login" });
    }
    if (results.length === 0) {
      return res.status(401).json({ error: "User not found" });
    }
    const user = results[0];
    try {
      return res.status(200).send(user);
    } catch (error) {
      return res.status(500).json({ error: "Internal ServerError 3" });
    }
  });
});

router.post("/auth", async (req, res) => {
  const token = req.body.token;

  if (!token) {
    return res.status(400).json({ error: "Token not provided" });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, jwtSecret);

    // Extract user information from the decoded token
    const { email } = decoded.user;

    // Here you can perform additional actions, such as fetching user data from the database
    // For now, let's just return the email
    return res.status(200).json({ email: email });
  } catch (error) {
    console.error("Error decoding token:", error);
    return res.status(401).json({ error: "Invalid token" });
  }
});

router.post("/addToCart", [], async function (req, res) {
  const { customerEmail, productId, quantity } = req.body;

  // Get the customer's ID based on the email
  const customerIdQuery = "SELECT ID FROM User WHERE Email = ?";
  connection.query(
    customerIdQuery,
    [customerEmail],
    (customerIdErr, customerIdResult) => {
      if (customerIdErr) {
        console.error(customerIdErr);
        return res.status(500).json({ error: "Internal server error" });
      }

      if (customerIdResult.length === 0) {
        return res.status(404).json({ error: "Customer not found" });
      }

      const customerId = customerIdResult[0].ID;

      // Check if the product already exists in the cart
      const checkIfExistsQuery =
        "SELECT * FROM Cart WHERE ProductId = ? AND CustomerId = ?";
      connection.query(
        checkIfExistsQuery,
        [productId, customerId],
        (checkIfExistsErr, checkIfExistsResult) => {
          if (checkIfExistsErr) {
            console.error(checkIfExistsErr);
            return res.status(500).json({ error: "Internal server error" });
          }

          if (checkIfExistsResult.length > 0) {
            // If the product exists, update the quantity
            const updateQuantityQuery =
              "UPDATE Cart SET Quantity = Quantity + ? WHERE ProductId = ? AND CustomerId = ?";
            connection.query(
              updateQuantityQuery,
              [quantity, productId, customerId],
              (updateErr) => {
                if (updateErr) {
                  console.error(updateErr);
                  return res
                    .status(500)
                    .json({ error: "Internal server error" });
                }
                return res
                  .status(200)
                  .json({ message: "Cart updated successfully" });
              }
            );
          } else {
            // If the product doesn't exist, insert a new row
            const insertItemQuery =
              "INSERT INTO Cart (CustomerId, ProductId, Quantity) VALUES (?, ?, ?)";
            connection.query(
              insertItemQuery,
              [customerId, productId, quantity],
              (insertErr) => {
                if (insertErr) {
                  console.error(insertErr);
                  return res
                    .status(500)
                    .json({ error: "Internal server error" });
                }
                return res
                  .status(200)
                  .json({ message: "Item added to cart successfully" });
              }
            );
          }
        }
      );
    }
  );
});

router.post("/placeOrder", async (req, res) => {
  try {
    const productId = req.body.productId;
    const customerEmail = req.body.customerEmail;
    const quantity = req.body.quantity;
    const totalBill = req.body.totalBill;

    const findCustomerIdQuery = "SELECT ID FROM User WHERE Email = ?";
    connection.query(
      findCustomerIdQuery,
      [customerEmail],
      (customerIdErr, customerIdResult) => {
        if (customerIdErr) {
          console.error("Error finding customer ID:", customerIdErr);
          return res.status(500).json({ error: "Error finding customer ID" });
        }

        if (customerIdResult.length === 0) {
          return res.status(404).json({ error: "Customer not found" });
        }

        const customerId = customerIdResult[0].ID;
        const today = new Date();
        const year = today.getFullYear();
        let month = today.getMonth() + 1;
        let day = today.getDate();

        month = month < 10 ? `0${month}` : month;
        day = day < 10 ? `0${day}` : day;

        const formattedDate = `${year}-${month}-${day}`;

        // If the row doesn't exist, insert a new row
        const insertOrderQuery =
          "INSERT INTO Orders (ProductId, Status, CustomerId, Date, Review, Quantity, TotalBill) VALUES (?, 'pending', ?, ?, NULL, ?, ?)";
        connection.query(
          insertOrderQuery,
          [productId, customerId, formattedDate, quantity, totalBill],
          (insertErr) => {
            if (insertErr) {
              console.error("Error inserting order:", insertErr);
              return res.status(500).json({ error: "Error inserting order" });
            }
            return res
              .status(200)
              .json({ message: "Order inserted successfully" });
          }
        );
      }
    );
  } catch (error) {
    console.error("Error during Place Order:", error);
    return res.status(500).json({ error: "Error during Place Order" });
  }
});

router.post("/getOrders", async (req, res) => {
  try {
    const userId = req.body.customerId;

    // Check if userId is provided
    if (!userId) {
      return res.status(400).json({ error: "userId required" });
    }

    // Construct the SQL query to retrieve orders and product details based on userId
    const ordersQuery = `
        SELECT Orders.*, Product.*, Orders.ID AS OrderId, Product.Id AS ProductId, Orders.Quantity AS OrderQuantity
        FROM Orders
        JOIN Product ON Orders.ProductId = Product.ID
        WHERE Orders.CustomerId = ? ORDER BY Orders.ID DESC
      `;

    // Execute the SQL query with dynamic conditions
    connection.query(ordersQuery, [userId], (err, orders) => {
      if (err) {
        console.error("Error retrieving current orders:", err);
        return res
          .status(500)
          .json({ error: "Error retrieving current orders" });
      }

      // If no orders found for the given userId
      if (orders.length === 0) {
        return res
          .status(404)
          .json({ message: "No orders found for the given userId" });
      }

      return res.status(200).json({ currentOrders: orders });
    });
  } catch (error) {
    console.error("Error retrieving current orders:", error);
    return res.status(500).json({ error: "Error retrieving current orders" });
  }
});

router.post("/cancelOrder", async (req, res) => {
  try {
    const { orderId, customerId, productId, status } = req.body;

    // Check if customerId, productId, and status are provided
    if (!customerId || !productId || !status || !orderId) {
      return res.status(400).json({
        error: "orderId, customerId, productId, and status are required",
      });
    }

    // Check if the status is valid
    if (status !== "pending" && status !== "approved") {
      return res.status(400).json({ message: "Invalid status" });
    }

    // Check the current status of the order
    connection.query(
      "SELECT Status FROM Orders WHERE customerId = ? AND productId = ? AND Status = ? AND ID = ?",
      [customerId, productId, status, orderId],
      (err, result) => {
        if (err) {
          console.error("Error checking order status:", err);
          return res.status(500).json({ error: "Error cancelling order" });
        }

        if (result.length === 0) {
          return res.status(404).json({ error: "Order not found" });
        }

        // Update the order status to 'cancelled' in the Orders table
        connection.query(
          "UPDATE Orders SET Status = 'cancelled' WHERE customerId = ? AND productId = ? AND Status = ? AND ID = ?",
          [customerId, productId, status, orderId],
          (err, result) => {
            if (err) {
              console.error("Error cancelling order:", err);
              return res.status(500).json({ error: "Error cancelling order" });
            }
            return res
              .status(200)
              .json({ message: "Order cancelled successfully" });
          }
        );
      }
    );
  } catch (error) {
    console.error("Error cancelling order:", error);
    return res.status(500).json({ error: "Error cancelling order" });
  }
});

router.post("/getCartItem", async function (req, res) {
  const { customerId } = req.body;

  // Check if customerId is provided
  if (!customerId) {
    return res.status(400).json({ error: "customerId required" });
  }

  try {
    // Retrieve all cart items for the given customerId
    const cartSql =
      "SELECT p.*, c.CustomerId, c.Quantity AS cartQuantity FROM Cart c JOIN Product p ON p.ID = c.ProductId WHERE CustomerId = ?";
    const cartResult = await new Promise((resolve, reject) => {
      connection.query(cartSql, [customerId], (cartErr, cartResult) => {
        if (cartErr) {
          console.error(cartErr);
          reject({ error: "Internal server error" });
        }
        resolve(cartResult);
      });
    });

    return res.status(200).json({ cartResult });
  } catch (error) {
    return res.status(500).json(error);
  }
});

router.post("/deleteCartItem", async function (req, res) {
  const { customerId, productId } = req.body;

  // Check if customerId and productId are provided
  if (!customerId || !productId) {
    return res.status(400).json({ error: "customerId and productId required" });
  }

  // Delete the specific item from Cart table for the given customerId and productId
  const sql = "DELETE FROM Cart WHERE CustomerId = ? AND ProductId = ?";
  connection.query(sql, [customerId, productId], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Internal server error" });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Item not found in the cart" });
    }
    return res
      .status(200)
      .json({ success: true, message: "Cart item deleted successfully" });
  });
});
router.post("/setRating", async function (req, res) {
  const { orderId, productId, rating } = req.body;

  // Check if productId and rating are provided
  if (!productId || !rating) {
    return res.status(400).json({ error: "productId and rating required" });
  }

  try {
    const ordersCountSql =
      "SELECT COUNT(*) AS ordersCount, SUM(Review) AS ReviewSum FROM Orders WHERE ProductId = ? AND Review IS NOT NULL";

    connection.query(ordersCountSql, [productId], (err, ordersResult) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Internal server error" });
      }

      const ordersCount = ordersResult[0].ordersCount + 1;
      const ReviewSum = ordersResult[0].ReviewSum;

      // Calculate the new rating by adding the new rating to the current rating and dividing it by the orders count
      let newRating = 0.0;
      if (ordersCount <= 0 || ReviewSum == null) {
        newRating = rating;
      } else {
        newRating = (parseInt(ReviewSum) + parseInt(rating)) / ordersCount;
      }

      // Update the rating of the product
      const updateRatingSql = "UPDATE Product SET Rating = ? WHERE ID = ?";
      connection.query(updateRatingSql, [newRating, productId], (err) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: "Internal server error" });
        }

        const updateOrderReview =
          "UPDATE Orders SET Review=? WHERE ProductId = ? AND ID=?";
        connection.query(
          updateOrderReview,
          [rating, productId, orderId],
          (err) => {
            if (err) {
              console.error(err);
              return res.status(500).json({ error: "Internal server error" });
            }

            return res
              .status(200)
              .json({ message: "Rating updated successfully", newRating });
          }
        );
      });
    });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
