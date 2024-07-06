import React, { useContext } from "react";
import Modal from "@mui/material/Modal";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";

export default function OrderSummaryPopup(props) {
  const navigate = useNavigate();
  const { cartCount, setCartCount } = useContext(UserContext);

  const placeOrder = async () => {
    try {
      const token = localStorage.getItem("auth-token");
      if (!token) {
        // Handle unauthorized user
        navigate("/login");
        return;
      }

      // Fetch user data
      const response = await axios.post(
        `${props.host}/auth`,
        { token },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const userData = response.data;

      const requestBody = {
        productId: props.productId,
        customerEmail: userData.email,
        quantity: props.qty,
        totalBill: props.qty * props.price,
      };

      if (props.fromCart) {
        const response = await axios.post(
          `${props.host}/getUser`,
          {
            email: userData.email,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        const customerId = response.data.ID;

        await axios.post(
          `${props.host}/deleteCartItem`,
          {
            customerId: customerId,
            productId: props.productId,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        setCartCount(cartCount - 1);
      }

      await axios.post(`${props.host}/placeOrder`, requestBody, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      props.setPlaceOrderAlert(true);
      props.handleClose();
    } catch (error) {
      console.error(error);
      // Handle error
    }
  };

  return (
    <>
      <div>
        <Modal
          open={props.open}
          onClose={props.handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <div className="bg-white absolute w-1/2 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-4">
            <strong className="text-3xl">Order Summary</strong>
            <div className="py-3">
              <h1 className="text-2xl m-1">{props.name}</h1>
              <p className="text-xl m-1">
                Unit Price: <em> Rs. {props.price}</em>{" "}
              </p>
              <p className="text-xl m-1">
                Qunatity: <em>{props.qty} </em>
              </p>
              <p className="text-xl m-1">
                Net Bill: Rs. <em>{props.qty * props.price}</em>{" "}
              </p>
            </div>
            <div className="flex justify-end">
              <button
                className="bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white text-lg font-bold py-2 px-4 transform -skew-x-12"
                onClick={placeOrder}
              >
                Place Order
              </button>
            </div>
          </div>
        </Modal>
      </div>
    </>
  );
}
