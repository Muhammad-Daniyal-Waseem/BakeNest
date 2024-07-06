import React, { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import axios from "axios";

export default function Navbar() {
  const { host } = useContext(UserContext);
  const [name, setName] = useState("");

  const fetchData = async () => {
    const token = localStorage.getItem("auth-token");
    if (!token) {
      return;
    }

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
      const userData = response.data;
      setName(userData.Name);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <nav className="w-full border-b">
        <ul className="flex justify-between">
          <div className="flex">
            <li
              className={`mx-3 my-4 text-lg text-slate-800 hover:text-slate-600`}
            >
              <Link to="/" rel="noopener noreferrer">
                Home
              </Link>
            </li>
            <li
              className={`mx-3 my-4 text-lg text-slate-800 hover:text-slate-600`}
            >
              <Link to="/orders" rel="noopener noreferrer">
                Orders
              </Link>
            </li>
            <li
              className={`mx-3 my-4 text-lg text-slate-800 hover:text-slate-600`}
            >
              <Link to="/cart" rel="noopener noreferrer">
                Cart
              </Link>
            </li>
          </div>
          <div className="mx-3 my-4 text-lg text-slate-800 hover:text-slate-600">
            {name ? `Welcome! ${name}` : "Please Sign In"}
          </div>
        </ul>
      </nav>
    </>
  );
}
