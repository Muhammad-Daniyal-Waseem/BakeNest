import React, { useState, useContext, useEffect } from "react";
import Header from "./Header";
import OrderSummaryPopup from "./OrderSummaryPopup";
import axios from "axios";
import { ProductContext } from "../context/ProductContext";
import Alert from "@mui/material/Alert";
import Rating from "@mui/material/Rating";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";

export default function ProductDetail() {
  const { object, host } = useContext(ProductContext);
  const {cartCount, setCartCount} = useContext(UserContext)
  const [qty, setQty] = useState(1);
  const [isVisible, setIsVisible] = useState(false);
  const [addToCartAlet, setAddToCartAlet] = useState(false);
  const [placeOrderAlert, setPlaceOrderAlert] = useState(false);
  const navigate = useNavigate();

  const incrementQuantity = () => {
    setQty(qty + 1);
  };

  const decrementQuantity = () => {
    if (qty > 1) {
      setQty(qty - 1);
    }
  };

  const handleAddToCart = async () => {
    try {
      const token = localStorage.getItem("auth-token");
      if (!token) {
        // Handle unauthorized user
        navigate("/login");
        return;
      }

      // Fetch user data
      const response = await axios.post(
        `${host}/auth`,
        { token },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const userData = response.data;
      // Assuming userId is available in userData
      const requestBody = {
        customerEmail: userData.email,
        productId: object.productId,
        quantity: qty,
      };

      // Add item to cart
      const addToCartResponse = await axios.post(
        `${host}/addToCart`,
        requestBody,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      setAddToCartAlet(!addToCartAlet);
      setCartCount(cartCount + 1);
    } catch (error) {
      console.error(error);
      // Handle error
    }
  };

  const [orderSummaryModalOpen, setOrderSummaryModalOpen] = useState(false);

  const handleExpandClick1 = () => {
    const token = localStorage.getItem("auth-token");
    if (!token) {
      // Handle unauthorized user
      navigate("/login");
      return;
    }
    if (object.productQuantity < qty) {
      console.log(object.productQuantity, qty, isVisible);
      setIsVisible(!isVisible);
      return;
    }
    setOrderSummaryModalOpen(true);
  };

  useEffect(() => {
    if (Object.keys(object).length === 0 && object.constructor === Object) {
      navigate("/");
    }
  }, []);

  return (
    <>
      <Header />

      {isVisible && (
        <div className="p-4">
          <Alert
            severity="error"
            onClose={() => {
              setIsVisible(!isVisible);
            }}
          >
            Items exceeds our current stock availability. Please adjust the
            quantity or consider selecting alternative products.
          </Alert>
        </div>
      )}

      {addToCartAlet && (
        <div className="p-4">
          <Alert
            severity="success"
            onClose={() => {
              setAddToCartAlet(!addToCartAlet);
            }}
          >
            Product Add to{" "}
            <a
              className="text-amber-500 hover:text-amber-700 underline"
              href="/cart"
            >
              Cart
            </a>{" "}
            Successfully
          </Alert>
        </div>
      )}

      {placeOrderAlert && (
        <div className="p-4">
          <Alert
            severity="success"
            onClose={() => {
              setPlaceOrderAlert(!placeOrderAlert);
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

      <div className="mb-4">
        <div className="mx-4">
          <h5 className="text-4xl mt-4">Product Detail</h5>
          <hr className="h-px my-6 mx-auto bg-gray-400 border-0 dark:bg-gray-700"></hr>
        </div>
      </div>

      <div className=" bg-white my-4">
        <div className="flex flex-col lg:flex-row w-4/6 m-auto h-4/6 shadow-2xl overflow-hidden rounded-lg">
          <div className="lg:w-1/2 h-4/5 border-r border-gray-400 relative p-4">
            <div className="flex hover:bg-transparent transition duration-300 absolute bottom-0 top-0 right-0 left-0 opacity-15"></div>
            <img
              className="h-[400px] w-[400px] object-cover"
              src={object.image}
              alt="Image"
            />
          </div>
          <div className="lg:w-1/2 flex flex-col justify-between">
            <div className="m-5">
              <div className="py-3">
                <strong className="text-3xl">{object.name}</strong>
              </div>
              <div className="py-3">
                <p className="text-xl font-viga">{object.description}</p>
              </div>
              <div className="flex justify-end">
                <span className="px-3 text-lg font-semibold">Quantity:</span>
                <div className="flex border border-gray-500">
                  <button
                    type="button"
                    onClick={decrementQuantity}
                    className="text-gray-600 text-xl w-8 h-8 flex items-center justify-center mr-2 border-r border-gray-500"
                  >
                    -
                  </button>
                  <em>
                    <span>{qty}</span>
                  </em>
                  <button
                    type="button"
                    onClick={incrementQuantity}
                    className="text-gray-600 text-xl w-8 h-8 flex items-center justify-center ml-2 border-l border-gray-500"
                  >
                    +
                  </button>
                </div>
              </div>
              <h1 className="text-2xl">Rating</h1>
              <div className="bg-rded-900 my-4 flex items-center">
                <p className="text-2xl pr-4">{Math.floor(object.rating * 10) / 10}</p>
                <Rating
                  name="read-only"
                  value={Math.floor(object.rating * 10) / 10}
                  precision={0.1}
                  readOnly
                />
              </div>
              <div className="text-3xl mt-5">
                Rs.{" "}
                <span className="text-amber-500 font-bold">{object.price}</span>
              </div>
              <hr />
            </div>
            <div className="self-end m-4">
              <button
                className="bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white text-lg font-bold py-2 px-4 transform -skew-x-12"
                onClick={handleExpandClick1}
              >
                Buy Now
              </button>
              <button
                type="button"
                onClick={handleAddToCart}
                className="bg-amber-500 hover:bg-amber-600 text-white text-lg font-bold py-2 px-4 transform -skew-x-12"
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>

      <OrderSummaryPopup
        open={orderSummaryModalOpen}
        handleClose={() => {
          setOrderSummaryModalOpen(false);
        }}
        productId={object.productId}
        name={object.name}
        price={object.price}
        qty={qty}
        host={host}
        setPlaceOrderAlert={setPlaceOrderAlert}
        fromCart={false}
      />
    </>
  );
}
