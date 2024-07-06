// Function to create the productinfo table if it doesn't exist
function createProductInfoTable() {
    const sql = `
        CREATE TABLE IF NOT EXISTS productinfo (
            idproductinfo INT AUTO_INCREMENT PRIMARY KEY,
            ProductName VARCHAR(255) NOT NULL,
            ProductPrice DECIMAL(10, 2) NOT NULL,
            ProductDescription TEXT NOT NULL
        )
    `;

    connection.query(sql, (err, result) => {
        if (err) {
            console.error('Error creating productinfo table:', err);
            return;
        }
        console.log('Productinfo table created or already exists');
    });
}


createProductInfoTable();

// Route to add a new product
app.post('/admin/addproduct', function(req, res) {
    const sql = "INSERT INTO productinfo (ProductName, ProductPrice, ProductDescription) VALUES (?, ?, ?)";
    const values = [
        req.body.pname,
        req.body.price,
        req.body.pdesc
    ];

    connection.query(sql, values, (err, result) => {
        if (err) {
            console.error('Error adding product:', err);
            return res.status(500).json({ error: 'Internal server error' });
        }
        return res.status(200).json({ message: 'Product added successfully' });
    });
});

// Route to update a product
app.post('/admin/updateproduct/:id', function(req, res) {
    const productId = req.params.id;
    const { pname, price, pdesc } = req.body;
    const sql = "UPDATE productinfo SET ProductName = ?, ProductPrice = ?, ProductDescription = ? WHERE idproductinfo = ?";
    const values = [pname, price, pdesc, productId];
    connection.query(sql, values, (err, result) => {
        if (err) {
            console.error('Error updating product:', err);
            return res.status(500).json({ error: 'Internal server error' });
        }
        return res.status(200).json({ message: 'Product updated successfully' });
    });
});