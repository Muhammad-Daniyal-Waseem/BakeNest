const express = require("express");
const app = express();
const router = express.Router();
const cors = require("cors");

app.use(cors());
app.use(express.json());

// Import and use routes
app.use("/", require("./route"));
app.use("/Product", require("./AdminRoutes/ProductRoutes"));
app.use("/Statistics", require("./AdminRoutes/StatisticsRoutes"));
app.use("/Orders", require("./AdminRoutes/OrderRoutes"));

const port = 3000; // Choose any available port you prefer
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
module.exports = router;
