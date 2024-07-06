import React, { useEffect, useState, useContext } from "react";
import { ProductContext } from "../context/ProductContext";
import axios from "axios";
import CartCard from "./CartCard";
import Alert from "@mui/material/Alert";
import Header from "./Header";
import { Navigate, useNavigate } from "react-router-dom";

export default function Cart(props) {
  const [check,setchecker]=useState(false);
  const [products, setProducts] = useState([]);
  const [customerId, setcustomerId] = useState();
  const { host } = useContext(ProductContext);
  const [placeOrderAlert, setPlaceOrderAlert] = useState(false);
  const [deleteAlert, setDeleteAlert] = useState(false);
  const navigate=useNavigate();
  useEffect(() => {
    const token = localStorage.getItem("auth-token");
    if (!token) {
      // Handle unauthorized user
      navigate('/login');
      return;
    }
    const fetchData = async () => {
      try {
        const responseAuth = await axios.post(
          `${host}/auth`,
          { token: token },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        console.log(responseAuth.data);
        // Fetch user data
        const response = await axios.post(
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
        if(response.data.Admin)
          {
            navigate("/admin");
return;
          }
          setchecker(true);

        // A
        const userData = response.data;
        // Assuming userId is available in userData
        const requestBody = {
          customerId: userData.ID,
        };
        setcustomerId(userData.ID);
        // Add item to cart
        const addToCartResponse = await axios.post(
          `${host}/getCartItem`,
          requestBody,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        setProducts(addToCartResponse.data.cartResult);
        console.log(addToCartResponse.data.cartResult);
        if (products.length > 0) {
          localStorage.setItem("Cart-items", products.length);
        }
        // props.setCartlength(products.length);
      } catch (error) {
        console.error(error);
        // Handle error
      }
    };

    fetchData();
  }, [products.length, placeOrderAlert, deleteAlert]);

  return (
    check&&(
    <>
      <Header />
      <div className="mb-4">
        <div className="mx-4">
          <h5 className="text-4xl mt-4">Cart</h5>
          <hr className="h-px my-6 mx-auto bg-gray-400 border-0 dark:bg-gray-700"></hr>
        </div>
      </div>

      {placeOrderAlert && (
        <div className="p-4">
          <Alert
            severity="success"
            onClose={() => {
              setPlaceOrderAlert(false);
            }}
          >
            <a
              className="text-amber-500 hover:text-amber-700 underline"
              href="/orders"
            >
              Order
            </a>{" "}
            Placed Successfully
          </Alert>
        </div>
      )}

      {deleteAlert && (
        <div className="p-4">
          <Alert
            severity="success"
            onClose={() => {
              setDeleteAlert(false);
            }}
          >
            Delete Successfully
          </Alert>
        </div>
      )}

      {products.length == 0 && (
        <a href="/">
          {" "}
          <div className="flex mt-11 flex-col items-center justify-center h-full">
            <svg
              className="w-16 h-16 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            <p className="text-lg font-medium text-gray-500 mt-4">
              Your cart is empty
            </p>
            <p className="text-gray-400 mt-2">
              Looks like you haven't added anything to your cart yet.
            </p>
          </div>
        </a>
      )}
      <div className="">
        {products.map((item) => (
          <CartCard
            key={item.ID}
            product={item}
            setPlaceOrderAlert={setPlaceOrderAlert}
            setDeleteAlert={setDeleteAlert}
          />
        ))}
      </div>
    </>)
  );
}
