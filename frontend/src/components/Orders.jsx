import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import OrderCard from "./OrderCard";
import Header from "./Header";
import { UserContext } from "../context/UserContext";
import CircularProgress from "@mui/material/CircularProgress";
import { Navigate, useNavigate } from "react-router-dom";
export default function Orders(props) {
  const { host } = useContext(UserContext);
  const [currentOrders, setCurrentOrders] = useState([]);
  const [selectedOption, setSelectedOption] = useState("pending"); // Set 'pending' as default
  const [Open, setOpen] = useState(false);
  const [count, setcount] = useState(false);
  const [loding, setLoding] = useState(true);
  const [check,setchecker]=useState(false);

  const navigate = useNavigate();
  useEffect(() => {
    //props.setcarouseCheck(false);
    const token = localStorage.getItem("auth-token");
    if (!token) {
      // Handle unauthorized user
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

        const userData = responseGeUser.data;
        console.log("user",responseGeUser.data.Admin)
        if(responseGeUser.data.Admin)
          {
            navigate("/admin");
return;
          }
          setchecker(true);

        // Assuming userId is available in userData
        const requestBody = {
          customerId: userData.ID,
        };

        // Fetch current orders
        const ordersResponse = await axios.post(
          `${host}/getOrders`,
          requestBody,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        console.log(ordersResponse.data);
        setCurrentOrders(ordersResponse.data.currentOrders);
      } catch (error) {
        console.error(error);
        // Handle error
      }
    };
    setLoding(false);
    fetchData();
  }, [count]);

  function countOrdersByStatus() {
    if (!currentOrders || !selectedOption) {
      return 0;
    }
    return currentOrders.filter((order) => order.Status === selectedOption).length;
  }


  const [selectStatusOrdersCount, setSelectStatusOrdersCount] = useState(0);

  useEffect(() => {
    const val = countOrdersByStatus();
    setSelectStatusOrdersCount(val);
    console.log(val);
  }, [selectedOption, currentOrders])
  

  return (
    check && (
    <>
      <Header />
      <div className="mx-4">
        <h5 className="text-4xl mt-4">Orders</h5>
        <hr className="h-px my-6 mx-auto bg-gray-400 border-0 dark:bg-gray-700"></hr>
      </div>
      <div className="flex justify-center mx-4">
        <div className="flex">
          <button
            className={`py-2 px-4 rounded-l-lg ${
              selectedOption === "pending"
                ? "bg-yellow-500 text-white"
                : "bg-gray-300"
            }`}
            onClick={() => setSelectedOption("pending")}
          >
            Pending
          </button>
          <button
            className={`py-2 px-4 ${
              selectedOption === "approved"
                ? "bg-green-500 text-white"
                : "bg-gray-300"
            }`}
            onClick={() => setSelectedOption("approved")}
          >
            Approved
          </button>
          <button
            className={`py-2 px-4 ${
              selectedOption === "completed"
                ? "bg-green-800 text-white"
                : "bg-gray-300"
            }`}
            onClick={() => setSelectedOption("completed")}
          >
            Completed
          </button>
          <button
            className={`py-2 px-4 ${
              selectedOption === "cancelled"
                ? "bg-red-500 text-white"
                : "bg-gray-300"
            }`}
            onClick={() => setSelectedOption("cancelled")}
          >
            Cancelled
          </button>
          <button
            className={`py-2 px-4 rounded-r-lg ${
              selectedOption === "rejected"
                ? "bg-red-800 text-white"
                : "bg-gray-300"
            }`}
            onClick={() => setSelectedOption("rejected")}
          >
            Rejected
          </button>
        </div>
      </div>

      {Open && (
        <h1 className="text-center text-lg font-semibold mt-4 bg-red-300 p-2 mx-6">
          Order cancelled!
        </h1>
      )}

      {loding && (
        <div className="flex justify-center my-4">
          <CircularProgress />
        </div>
      )}
      {selectStatusOrdersCount === 0 && (
        <>
          <div className="flex justify-center w-1/2 mx-auto my-10">
            <p className="text-xl text-slate-600 font-semibold workSans">
              No orders for {selectedOption} status
            </p>
          </div>
        </>
      )}

      {currentOrders.map((order, index) => (
        <OrderCard
          key={index}
          ID={order.OrderId}
          image={order.Image}
          Product={order.Name}
          Status={order.Status}
          Quantity={order.OrderQuantity}
          TotalBill={order.TotalBill}
          Review={order.Review}
          Description={order.Description}
          ProductId={order.ProductId}
          CustomerId={order.CustomerId}
          Date={order.Date}
          selectedOption={selectedOption}
          setOpen={setOpen}
          Open={Open}
          setcount={setcount}
          count={count}
        />
      ))}
    </>)
  );
}
