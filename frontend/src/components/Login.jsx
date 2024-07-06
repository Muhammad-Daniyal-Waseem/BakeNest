import React, { useState, useContext } from "react";
// import SignUp from "./SignUp";
import { UserContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

import Alert from "@mui/material/Alert";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const { login } = useContext(UserContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = { email, password };

    try {
      const res = await login(formData);
      console.log("login", res.user);
      if (res.user.Admin) {
        navigate("/admin");
      } else {
        navigate("/");
      }

      console.log("Login successful.");
    } catch (error) {
      console.error("Login failed:", error);
      setError("Incorrect email or passwrod");
    }
  };

  return (
    <>
      {/* <!-- https://play.tailwindcss.com/MIwj5Sp9pw --> */}
      <div className="py-16 h-screen">
        <div className="flex bg-white rounded-lg shadow-lg overflow-hidden mx-auto max-w-sm lg:max-w-4xl h-full">
          <div
            className="hidden lg:block lg:w-1/2 bg-cover"
            style={{
              backgroundImage:
                "url('https://cdn.pixabay.com/photo/2016/12/08/19/08/bread-1892907_1280.jpg')",
            }}
          ></div>
          <div className="w-full p-8 lg:w-1/2">
            <h2 className="text-2xl font-semibold text-gray-700 text-center">
              Login
            </h2>
            <p className="text-xl text-gray-600 text-center">Welcome back!</p>
            {error && <Alert severity="error">{error}</Alert>}
            {/* Input field for email */}
            <div className="mt-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Email Address
              </label>
              <input
                className="bg-gray-200 text-gray-700 focus:outline-none focus:shadow-outline border border-gray-300 rounded py-2 px-4 block w-full appearance-none"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)} // Update email state on change
              />
            </div>
            {/* Input field for password */}
            <div className="mt-4">
              <div className="flex justify-between">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Password
                </label>
                <a href="#" className="text-xs text-gray-500">
                  Forget Password?
                </a>
              </div>
              <input
                className="bg-gray-200 text-gray-700 focus:outline-none focus:shadow-outline border border-gray-300 rounded py-2 px-4 block w-full appearance-none"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)} // Update password state on change
              />
            </div>
            {/* Login button */}
            <div className="mt-8">
              <button
                className="bg-gray-700 text-white font-bold py-2 px-4 w-full rounded hover:bg-gray-600"
                onClick={handleSubmit}
              >
                Login
              </button>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <span className="border-b w-1/5 md:w-1/4"></span>
              <Link to="/signup" className="text-xs text-gray-500 uppercase">
                or sign up
              </Link>
              <span className="border-b w-1/5 md:w-1/4"></span>
            </div>
            <div className="flex justify-center mt-5 bg-gray-700 text-white w-full p-2 rounded hover:bg-gray-600">
              <Link
                to="/"
                className="w-full text-center"
              >
                VISIT BAKENEST{" "}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
