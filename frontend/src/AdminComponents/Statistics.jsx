import React, { useEffect, useState, useContext } from "react";
import OrdersByProduct from "./OrdersByProduct";
import OrdersByCustomer from "./OrdersByCustomer";
import AllOrders from "./AllOrders";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import axios from 'axios'

export default function Statistics() {
  const { host } = useContext(UserContext);

  const [check,setchecker]=useState(false);

  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem("auth-token");
    if (!token) {
      navigate("/login");
      return;
    }


    const fetchData = async () => {
      try {
        const responseAuth = await axios.post(
          `${host}/auth`,
          { token },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        // Fetch user data
        const responseGeUser = await axios.post(
          `${host}/getUser`,
          {
            email: responseAuth.data.email,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

    if(!responseGeUser.data.Admin)
      {
        navigate("/");
return;
      }
      setchecker(true);

    } catch (error) {
      console.error(error);
      // Handle error
    }}
    fetchData();
  }, []);

  function CustomTabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box sx={{ p: 3 }}>
            <Typography>{children}</Typography>
          </Box>
        )}
      </div>
    );
  }

  CustomTabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
  };

  function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      "aria-controls": `simple-tabpanel-${index}`,
    };
  }

  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    check&&
    <>
      <div className="mx-4">
        <h5 className="text-4xl mt-4">Statistics</h5>
        <hr className="h-px my-6 mx-auto bg-gray-400 border-0 dark:bg-gray-700"></hr>
      </div>
      <Box sx={{ width: "100%" }}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="basic tabs example"
          >
            <Tab label="All Orders" {...a11yProps(0)} />
            <Tab label="Orders by Product" {...a11yProps(1)} />
            <Tab label="Orders by Customer" {...a11yProps(2)} />
          </Tabs>
        </Box>
        <CustomTabPanel value={value} index={0}>
          <AllOrders />
        </CustomTabPanel>
        <CustomTabPanel value={value} index={1}>
          <OrdersByProduct />
        </CustomTabPanel>
        <CustomTabPanel value={value} index={2}>
          <OrdersByCustomer />
        </CustomTabPanel>
      </Box>
    </>
  );
}
