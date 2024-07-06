import React from "react";
import { useContext } from "react";
import { ProductContext } from "../context/ProductContext";
import OrderSummaryPopup from "./OrderSummaryPopup";
import Rating from "@mui/material/Rating";

import { useState } from "react";
import axios from "axios";
import { UserContext } from "../context/UserContext";

function CartCard(props) {
  const [isVisible, setIsVisible] = useState(false);
  const { host } = useContext(ProductContext);
  const { cartCount, setCartCount } = useContext(UserContext);
  const [orderSummaryModalOpen, setOrderSummaryModalOpen] = useState(false);

  const handleExpandClick1 = () => {
    setIsVisible(true);
    setOrderSummaryModalOpen(true);
  };

  const deleteCartItem = async () => {
    try {
      // Assuming customerId and productId are available in props
      const customerId = props.product.CustomerId;
      const productId = props.product.ID;

      // Make a POST request to deleteCartItem endpoint
      const response = await axios.post(
        `${host}/deleteCartItem`,
        {
          customerId,
          productId,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // Check if the deletion was successful
      if (response.data.success) {
        // Optionally, you can update the UI to reflect the deletion
        console.log("Cart item deleted successfully");
        setCartCount(cartCount - 1);
        props.setDeleteAlert(true);
      } else {
        console.error("Failed to delete cart item:", response.data.message);
      }
    } catch (error) {
      console.error("Error deleting cart item:", error);
      // Handle error
    }
  };

  return (
    <>
      <div className="flex flex-col lg:flex-row w-4/6 my-8 mx-auto h-4/6 shadow-2xl overflow-hidden rounded-lg">
        <div className="lg:w-1/2 h-4/5 border-r border-gray-400 relative p-4">
          <div className="flex hover:bg-transparent transition duration-300 absolute bottom-0 top-0 right-0 left-0 opacity-15"></div>
          <img
            className="h-[400px] w-[400px] object-cover"
            src={props.product.Image}
            alt="Image"
          />
        </div>
        <div className="lg:w-1/2 flex flex-col justify-between">
          <div className="m-5">
            <div className="py-3">
              <strong className="text-3xl">{props.product.Name}</strong>
            </div>
            <div className="py-3">
              <p className="text-xl font-viga">{props.product.Description}</p>
            </div>
            <div className="py-3 font-viga">
              <p className="text-lg">
                Quantity: <span>{[props.product.cartQuantity]}</span>
              </p>
            </div>
            <h1 className="text-2xl">Rating</h1>
            <div className="bg-rded-900 my-4 flex items-center">
              <p className="text-2xl pr-4">
                {Math.floor(props.product.Rating * 10) / 10}
              </p>
              <Rating
                name="read-only"
                value={Math.floor(props.product.Rating * 10) / 10}
                precision={0.1}
                readOnly
              />
            </div>
            <div className="text-3xl my-5">
              Rs.{" "}
              <span className="text-amber-500 font-bold">
                {props.product.Price}
              </span>
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
              onClick={deleteCartItem}
              className="bg-gradient-to-r from-red-500 to-red-700 hover:from-red-600 hover:to-red-800 text-white text-lg font-bold py-2 px-4 transform -skew-x-12"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
      <OrderSummaryPopup
        open={orderSummaryModalOpen}
        handleClose={() => {
          setOrderSummaryModalOpen(false);
        }}
        productId={props.product.ID}
        name={props.product.Name}
        price={props.product.Price}
        qty={[props.product.cartQuantity]}
        host={host}
        setPlaceOrderAlert={props.setPlaceOrderAlert}
        fromCart={true}
      />
    </>
  );
}

export default CartCard;
