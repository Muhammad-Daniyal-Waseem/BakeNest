import React, { useState, useContext, useEffect } from "react";
import dayjs from "dayjs";
import { UserContext } from "../context/UserContext";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Table from "@mui/joy/Table";
import Sheet from "@mui/joy/Sheet";
import IconButton from "@mui/joy/IconButton";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import Typography from "@mui/joy/Typography";

function Row({ row }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <tr>
        <td>
          <IconButton
            aria-label="expand row"
            variant="plain"
            color="neutral"
            size="sm"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </td>
        <th scope="row">{row.ID}</th>
        <td>{row.productName}</td>
        <td>{row.customerName}</td>
        <td>{row.Quantity}</td>
        <td>{row.Review}</td>
        <td>{row.TotalBill}</td>
      </tr>
      {open && (
        <tr>
          <td style={{ padding: 0 }} colSpan={7}>
            <Sheet
              variant="soft"
              sx={{
                p: 1,
                pl: 6,
                boxShadow: "inset 0 3px 6px 0 rgba(0 0 0 / 0.08)",
              }}
            >
              <Typography level="body-lg" component="div">
                Detail
              </Typography>
              <Table
                borderAxis="bothBetween"
                size="sm"
                aria-label="purchases"
                sx={{
                  "& > thead > tr > th:nth-child(n + 3), & > tbody > tr > td:nth-child(n + 3)":
                    { textAlign: "center" },
                  "--TableCell-paddingX": "0.5rem",
                }}
              >
                <thead>
                  <tr>
                    <th>Product ID</th>
                    <th>Customer ID</th>
                    <th>Date</th>
                    <th>Current Price</th>
                    <th>Unit Price</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr key={row.ID}>
                    <td>{row.ProductId}</td>
                    <td>{row.CustomerId}</td>
                    <td>{dayjs(row.Date).format("MMMM DD, YYYY")}</td>
                    <td>{row.Price}</td>
                    <td>{(row.TotalBill / row.Quantity).toFixed(2)}</td>
                    <td>{row.Status}</td>
                  </tr>
                </tbody>
              </Table>
            </Sheet>
          </td>
        </tr>
      )}
    </>
  );
}

export default function OrdersByCustomer() {
  const { host } = useContext(UserContext);
  const [customers, setCustomers] = useState();
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [selectedCustomerOrders, setSelectedCustomerOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleChangeProduct = (e) => {
    setSelectedCustomer(e.target.value);
  };

  const getCustomers = async () => {
    try {
      const url = `${host}/Statistics/getCustomers`;
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Something went wrong");
      } else {
        const json = await response.json();
        console.log(response)
        setCustomers(json.customers);
        setSelectedCustomer(json.customers[0].ID);
        setLoading(false);
        return json;
      }
    } catch (error) {
      console.log("Error occurred:", error);
      return [];
    }
  };

  const getOrders = async () => {
    try {
      
      const response = await fetch(`${host}/Statistics/getOrdersByCustomerID`, {
        method: "POST", // Change the method to POST
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ customerId: selectedCustomer })
      });

      if (!response.ok) {
        throw new Error("Something went wrong");
      }

      const json = await response.json();
      setSelectedCustomerOrders(json.orders);
      setLoading(false);
    } catch (error) {
      console.log("Error occurred:", error);
    }
  };

  useEffect(() => {
    if (selectedCustomer) {
      setLoading(true);
      getOrders();
    }
  }, [selectedCustomer]);

  useEffect(() => {
    setLoading(true);
    getCustomers();
  }, []);

  return (
    <>
      {customers && (
        <FormControl fullWidth>
          <InputLabel id="product-select-label">Product</InputLabel>
          <Select
            labelId="product-select-label"
            id="product-select"
            value={selectedCustomer || ""}
            onChange={handleChangeProduct}
            label="Product"
          >
            {/* Assuming selectedProductOrders contains the list of products */}
            {customers.map((customer) => (
              <MenuItem key={customer.ID} value={customer.ID}>
                {customer.ID} {customer.Name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}

      <div className="mx-auto my-10 shadow-2xl">
        <Sheet>
          {loading ? (
            <p className="text-xl">Loading...</p>
          ) : (
            <Table
              aria-label="collapsible table"
              sx={{
                "& > thead > tr > th:nth-child(n + 3), & > tbody > tr > td:nth-child(n + 3)":
                  { textAlign: "center" },
                '& > tbody > tr:nth-child(odd) > td, & > tbody > tr:nth-child(odd) > th[scope="row"]':
                  { borderBottom: 0 },
              }}
            >
              <thead>
                <tr>
                  <th
                    style={{
                      width: 40,
                      backgroundColor: "#1976D2",
                      color: "#FFFFFF",
                    }}
                    aria-label="empty"
                  />
                  <th
                    style={{
                      backgroundColor: "#1976D2",
                      color: "#FFFFFF",
                    }}
                  >
                    Order ID
                  </th>
                  <th style={{ backgroundColor: "#1976D2", color: "#FFFFFF" }}>
                    Product
                  </th>
                  <th style={{ backgroundColor: "#1976D2", color: "#FFFFFF" }}>
                    Customer
                  </th>
                  <th style={{ backgroundColor: "#1976D2", color: "#FFFFFF" }}>
                    Quantity
                  </th>
                  <th style={{ backgroundColor: "#1976D2", color: "#FFFFFF" }}>
                    Review
                  </th>
                  <th style={{ backgroundColor: "#1976D2", color: "#FFFFFF" }}>
                    Total Price (Rs.)
                  </th>
                </tr>
              </thead>
              <tbody>
                {selectedCustomerOrders.map((order) => (
                  <Row key={order.ID} row={order} />
                ))}
              </tbody>
            </Table>
          )}
        </Sheet>
      </div>
    </>
  );
}