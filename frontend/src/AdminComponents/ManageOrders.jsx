import React, { useState, useEffect,useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import axios from "axios";

const ManageOrders = (props) => {
  const { host } = useContext(UserContext);
  const [check,setchecker]=useState(false);

  const [orders, setOrders] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState(
    "Not Enough Product Quantity"
  );

  const navigate = useNavigate();
  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try { 
      const token = localStorage.getItem("auth-token");
      if (!token) {
        navigate("/login");
        return;
      }
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
    
      const response = await fetch("http://localhost:3000/Orders/allOrders");
      if (!response.ok) {
        throw new Error("Failed to fetch orders");
      }
      const data = await response.json();

      // Format date strings in the orders data
      const formattedOrders = data.map((order) => {
        // Convert ISO date string to Date object
        const date = new Date(order.Date);
        // Extract day, month, and year components
        const day = date.getDate();
        const month = date.getMonth() + 1; // Months are zero-based
        const year = date.getFullYear();
        // Format date as d/m/y
        const formattedDate = `${day}/${month}/${year}`;

        // Return updated order object with formatted date

        return { ...order, Date: formattedDate };
      });

      setOrders(formattedOrders);
      console.log(orders);
      
    } catch (error) {
      console.error("Error fetching orders:", error);
      // Handle error, e.g., display an error message to the user
    }
  };

  const rejectOrder = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:3000/Orders/rejectOrder/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to approve order");
      }
      fetchOrders();
    } catch (error) {
      console.error("Error approving order:", error);
      // Handle error
    }
  };
  const completeOrder = async (id) => {
    try {
      console.log(id);
      const response = await fetch(
        `http://localhost:3000/Orders/completeOrder/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to approve order");
      }
      fetchOrders();
    } catch (error) {
      console.error("Error approving order:", error);
      // Handle error
    }
  };
  const aprroveOrder = async (id) => {
    try {
      console.log(id);
      const response = await fetch(
        `http://localhost:3000/Orders/approveOrder/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) {
        if (response.status === 400) {
          setShowModal(true);
          throw new Error("Insufficient quantity available");
        } else {
          throw new Error("Failed to approve order");
        }
      }
      fetchOrders(); // Assuming this function fetches orders again to update UI
    } catch (error) {
      console.error("Error approving order:", error);
      // Handle error
    }
  };
  return (
    check&&
    <div>
      {showModal && (
        <div className="fixed z-50 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
            <div className="bg-white rounded-lg overflow-hidden shadow-xl transform transition-all sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <svg
                      className="h-6 w-6 text-red-600"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM9 7a1 1 0 012 0v5a1 1 0 11-2 0V7zm1 9a1 1 0 100-2 1 1 0 000 2z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3
                      className="text-lg leading-6 font-medium text-gray-900"
                      id="modal-title"
                    >
                      Error
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">{modalMessage}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setShowModal(false)}
                >
                  OK
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div class="">
        <div className="mx-4">
          <h5 className="text-4xl mt-4">Manage Orders</h5>
          <hr className="h-px my-6 mx-auto bg-gray-400 border-0 dark:bg-gray-700"></hr>
        </div>
        <div class="bg-white">
          <table class="w-full whitespace-nowrap">
            {orders.length > 0 ? (
              <thead>
                <tr>
                  <th className="text-center">Product</th>
                  <th className="text-center">Customer Name</th>
                  <th className="text-center">Address</th>
                  <th className="text-center">Date</th>
                  <th className="text-center">Contact</th>
                  <th className="text-center">Quantity</th>
                  <th className="text-center">Price</th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>
            ) : (
              <tr>
                <td className="focus:outline-none text-base sm:text-lg md:text-xl lg:text-2xl font-bold leading-normal text-gray-800s">
                  Message: No Orders
                </td>
              </tr>
            )}
            <tbody>
              {orders.map((order) => (
                <tr
                  tabindex="0"
                  class="focus:outline-none h-16 border border-gray-100 rounded"
                >
                  <td class="">
                    <div class="text-center">
                      <p class="text-base font-medium leading-none text-gray-700 px-4">
                        {order.ProductName}
                      </p>
                    </div>
                  </td>
                  <td class="">
                    <div class="text-center">
                      <p class="text-base font-medium leading-none text-gray-700 px-4">
                        {order.Name}
                      </p>
                    </div>
                  </td>
                  <td class="">
                    <div class="text-center">
                      <p class="text-sm leading-none text-gray-600 px-4">
                        {order.Address}
                      </p>
                    </div>
                  </td>
                  <td class="pl-5">
                    <div class="text-center">
                      <p class="text-sm leading-none text-gray-600 px-4">
                        {order.Date}
                      </p>
                    </div>
                  </td>
                  <td class="pl-5">
                    <div class="text-center">
                      <p class="text-sm leading-none text-gray-600 px-4">
                        {order.Contact}
                      </p>
                    </div>
                  </td>
                  <td class="pl-5">
                    <div class="text-center">
                      <p class="text-sm leading-none text-gray-600 px-4">
                        {order.Quantity}
                      </p>
                    </div>
                  </td>
                  <td class="pl-5">
                    <div class="text-center">                      
                      <p class="text-sm leading-none text-gray-600 px-4">
                        Rs. {order.TotalBill}
                      </p>
                    </div>
                  </td>
                  <td class="pl-5">
                    {order.Status === "pending" && (
                      <button
                        class="py-3 hover:bg-green-700 px-3 text-sm focus:outline-none leading-none text-white bg-green-500 rounded"
                        onClick={() => aprroveOrder(order.ID)}
                      >
                        Approve
                      </button>
                    )}
                    {order.Status === "approved" && (
                      <button
                        onClick={() => completeOrder(order.ID)}
                        class="py-3 px-3 text-sm hover:bg-green-900  focus:outline-none leading-none text-white bg-green-700 rounded"
                      >
                        Complete
                      </button>
                    )}
                  </td>
                  <td class="pl-4">
                    <button
                      onClick={() => rejectOrder(order.ID)}
                      class="py-3 px-3 text-sm hover:bg-red-900 focus:outline-none leading-none text-white bg-red-500 rounded"
                    >
                      Reject
                    </button>
                  </td>

                  <td></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManageOrders;
