const express = require('express');
const router = express.Router();
const connection = require("../database");

router.get('/allOrders', function (req, res) {
    const sql = `
    SELECT Orders.ID , Orders.ProductId, Orders.Status, Orders.CustomerId AS OrderCustomerId, Orders.Date , Orders.Quantity, Orders.TotalBill, Product.Name AS ProductName, User.ID AS CustomerId, User.Name, User.Address, User.Contact
    FROM Orders
    INNER JOIN Product ON Orders.ProductId = Product.ID
    INNER JOIN User ON Orders.CustomerId = User.ID
    WHERE Orders.Status IN ('pending', 'approved')
    ORDER BY Orders.ID DESC
    `;
    connection.query(sql, (err, orders) => {
        if (err) {
            console.error('Error fetching orders:', err);
            return res.status(500).json({ error: 'Internal server error' });
        }

        return res.status(200).json(orders);
    });
});

router.put('/approveOrder/:id', function (req, res) {
    const orderId = req.params.id;
    const sql = `
        UPDATE Orders
        SET Status = 'approved'
        WHERE ID = ? AND Status = 'pending'
    `;
    const selectSql = `
        SELECT Orders.*, Product.Name AS ProductName, User.*
        FROM Orders
        INNER JOIN Product ON Orders.ProductId = Product.ID
        INNER JOIN User ON Orders.CustomerId = User.ID
        WHERE Orders.ID = ?
    `;
    const checkQuantitySql = `
        SELECT Quantity
        FROM Product
        WHERE ID = (
            SELECT ProductId
            FROM Orders
            WHERE ID = ?
        )
    `;
    const updateProductQuantitySql = `
        UPDATE Product
        SET Quantity = Quantity - ?
        WHERE ID = (
            SELECT ProductId
            FROM Orders
            WHERE ID = ?
        )
    `;

    connection.query(checkQuantitySql, [orderId], (err, quantityResult) => {
        if (err) {
            console.error('Error checking product quantity:', err);
            return res.status(500).json({ error: 'Internal server error' });
        }
        const availableQuantity = quantityResult[0].Quantity;

        connection.query(selectSql, [orderId], (err, orderResult) => {
            if (err) {
                console.error('Error fetching order details:', err);
                return res.status(500).json({ error: 'Internal server error' });
            }
            const order = orderResult[0];

            if (order.Quantity > availableQuantity) {
                return res.status(400).json({ error: 'Insufficient quantity available' });
            }

            connection.query(sql, [orderId], (err, updateResult) => {
                if (err) {
                    console.error('Error updating order status:', err);
                    return res.status(500).json({ error: 'Internal server error' });
                }
                if (updateResult.affectedRows === 0) {
                    return res.status(404).json({ error: 'Order not found or status is not pending' });
                }
                connection.query(updateProductQuantitySql, [order.Quantity, orderId], (err, updateQuantityResult) => {
                    if (err) {
                        console.error('Error updating product quantity:', err);
                        return res.status(500).json({ error: 'Internal server error' });
                    }
                    connection.query(selectSql, [orderId], (err, updatedOrder) => {
                        if (err) {
                            console.error('Error fetching updated order:', err);
                            return res.status(500).json({ error: 'Internal server error' });
                        }
                        return res.status(200).json(updatedOrder[0]); // Return the updated order
                    });
                });
            });
        });
    });
});

router.put('/completeOrder/:id', function (req, res) {
    const orderId = req.params.id;
    const sql = `
        UPDATE Orders
        SET Status = 'completed'
        WHERE ID = ? AND Status = 'approved'
    `;
    const selectSql = `
        SELECT Orders.*, Product.Name AS ProductName, User.*
        FROM Orders
        INNER JOIN Product ON Orders.ProductId = Product.ID
        INNER JOIN User ON Orders.CustomerId = User.ID
        WHERE Orders.ID = ?
    `;
    connection.query(sql, [orderId], (err, result) => {
        if (err) {
            console.error('Error updating order status:', err);
            return res.status(500).json({ error: 'Internal server error' });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Order not found or status is not pending' });
        }
        connection.query(selectSql, [orderId], (err, updatedOrder) => {
            if (err) {
                console.error('Error fetching updated order:', err);
                return res.status(500).json({ error: 'Internal server error' });
            }
            return res.status(200).json(updatedOrder[0]); // Return the updated order
        });
    });
});

router.put('/rejectOrder/:id', function (req, res) {
    const orderId = req.params.id;
    const sql = `
    UPDATE Orders
    SET Status = 'rejected'
    WHERE ID = ? AND Status IN ('pending', 'approved')
    `;
    const selectSql = `
        SELECT Orders.*, Product.Name AS ProductName, User.*
        FROM Orders
        INNER JOIN Product ON Orders.ProductId = Product.ID
        INNER JOIN User ON Orders.CustomerId = User.ID
        WHERE Orders.ID = ?
    `;
    connection.query(sql, [orderId], (err, result) => {
        if (err) {
            console.error('Error updating order status:', err);
            return res.status(500).json({ error: 'Internal server error' });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Order not found or status is not pending' });
        }
        connection.query(selectSql, [orderId], (err, updatedOrder) => {
            if (err) {
                console.error('Error fetching updated order:', err);
                return res.status(500).json({ error: 'Internal server error' });
            }
            return res.status(200).json(updatedOrder[0]); // Return the updated order
        });
    });
});
function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Adding 1 since getMonth() returns 0-based index
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}router.get('/ordersByMonth', function (req, res) {
    // Get the current year and month
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1; // Adding 1 since getMonth() returns 0-based index

    // Array to hold orders by month
    const ordersByMonth = [];

    // Loop through each month of the current year
    for (let month = 1; month <= currentMonth; month++) {
        // Get the first and last day of the month
        const firstDayOfMonth = new Date(currentYear, month - 1, 1); // Subtracting 1 to adjust month index
        const lastDayOfMonth = new Date(currentYear, month, 0); // Last day of previous month is last day of current month

        // Format first and last day of month for SQL query
        const firstDayFormatted = formatDate(firstDayOfMonth);
        const lastDayFormatted = formatDate(lastDayOfMonth);

        // Query to count orders for the current month
        const sql = `
        SELECT COUNT(*) AS orderCount
        FROM Orders
        WHERE Date >= ? AND Date <= ? AND Status = 'completed'
        `;
        
        connection.query(sql, [firstDayFormatted, lastDayFormatted], (err, result) => {
            if (err) {
                console.error('Error fetching order count for month:', err);
                return res.status(500).json({ error: 'Internal server error' });
            }

            // Push order count for current month to the array
            ordersByMonth.push({ month: month, orderCount: result[0].orderCount });

            // If this is the last month, send the response
            if (month === currentMonth) {
                return res.status(200).json(ordersByMonth);
            }
        });
    }
});

module.exports = router;