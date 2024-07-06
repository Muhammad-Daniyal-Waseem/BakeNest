import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

import { UserContext } from "../context/UserContext";

import Alert from "@mui/material/Alert";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [address, setAddress] = useState("");
  const [c_password, setC_password] = useState("");
  const [contact, setContact] = useState("");

  const { host } = useContext(UserContext);
  const navigate = useNavigate();

  const handleContactChange = (e) => {
    const value = e.target.value;
    // Only update the state if the entered value is numeric
    if (!isNaN(value)) {
      setContact(value);
    }
  };

  const [error, setError] = useState("");

  const validateEmail = () => {
    const re = /\S+@\S+\.\S+/;
    if (!re.test(email)) {
      setError("Invalid email address");
      return false;
    }
    return true;
  };

  const validatePassword = () => {
    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return false;
    }
    if (password !== c_password) {
      setError("Passwords do not match. Reconfirm!");
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    setError(""); // Reset error state

    if (!name || !email || !password || !address || !contact || !c_password) {
      setError("Please fill in all fields");
      return;
    }
    if (!validateEmail() || !validatePassword()) {
      return;
    }
    console.log({ name, email, address, contact, password });
    // Proceed with API call
    try {
      const response = await axios.post(
        `${host}/signup`,
        { name, email, address, contact, password },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status === 200){
        const data = await response.data;
        localStorage.setItem("auth-token", data.token);
        navigate("/");
      }
      else {
        setError(response.data.error || "Error during registration");
      }
    } catch (err) {
      console.log(err);
      setError(err || "Error during registration");
    }
  };

  return (
    <>
      <div class="h-full bg-gray-400 dark:bg-gray-900">
        <div class="mx-auto">
          <div class="flex justify-center px-6 py-12">
            <div class="w-full xl:w-3/4 lg:w-11/12 flex">
              <div
                class="w-full h-auto bg-gray-400 dark:bg-gray-800 hidden lg:block lg:w-5/12 bg-cover rounded-l-lg"
                style={{
                  backgroundImage:
                    "url('https://cdn.pixabay.com/photo/2016/12/08/19/08/bread-1892907_1280.jpg')",
                }}
              ></div>
              <div class="w-full lg:w-7/12 bg-white dark:bg-gray-700 p-5 rounded-lg lg:rounded-l-none">
                <h3 class="py-4 text-2xl text-center text-gray-800 dark:text-white">
                  Create an Account!
                </h3>
                {error && <Alert severity="error">{error.toString()}</Alert>}
                <form class="px-8 pt-6 pb-8 mb-4 bg-white dark:bg-gray-800 rounded">
                  <div class="mb-4 md:flex md:justify-between">
                    <div class="mb-4 md:mr-2 md:mb-0">
                      <label
                        class="block mb-2 text-sm font-bold text-gray-700 dark:text-white"
                        for="Name"
                      >
                        Name
                      </label>
                      <input
                        class="w-full px-3 py-2 text-sm leading-tight text-gray-700 dark:text-white border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                        id="Name"
                        type="text"
                        placeholder="Name"
                        value={name}
                        onChange={(e) => {
                          setName(e.target.value);
                        }}
                      />
                    </div>
                    <div class="mb-4">
                      <label
                        class="block mb-2 text-sm font-bold text-gray-700 dark:text-white"
                        for="email"
                      >
                        Email
                      </label>
                      <input
                        class="w-full px-3 py-2 mb-3 text-sm leading-tight text-gray-700 dark:text-white border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                        id="email"
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                        }}
                      />
                    </div>
                    <div class="md:ml-2">
                      <label
                        class="block mb-2 text-sm font-bold text-gray-700 dark:text-white"
                        for="Address"
                      >
                        Address
                      </label>
                      <input
                        class="w-full px-3 py-2 text-sm leading-tight text-gray-700 dark:text-white border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                        id="Address"
                        type="text"
                        placeholder="Address"
                        value={address}
                        onChange={(e) => {
                          setAddress(e.target.value);
                        }}
                      />
                    </div>
                  </div>
                  <div class="md:ml-2">
                    <div class="md:ml-2">
                      <label
                        class="block mb-2 text-sm font-bold text-gray-700 dark:text-white"
                        for="Contact"
                      >
                        Contact
                      </label>
                      <input
                        class="w-full px-3 py-2 text-sm leading-tight text-gray-700 dark:text-white border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                        id="Contact"
                        type="text"
                        placeholder="Contact"
                        pattern="[0-9]*"
                        value={contact}
                        onChange={handleContactChange}
                        title="Please enter only numeric values"
                      />
                    </div>

                    {/* <ContactInput /> */}
                  </div>

                  <div class="mb-4 md:flex md:justify-between">
                    <div class="mb-4 md:mr-2 md:mb-0">
                      <label
                        class="block mb-2 text-sm font-bold text-gray-700 dark:text-white"
                        for="password"
                      >
                        Password
                      </label>
                      <input
                        class="w-full px-3 py-2 mb-3 text-sm leading-tight text-gray-700 dark:text-white border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                        id="password"
                        type="password"
                        placeholder="******************"
                        value={password}
                        onChange={(e) => {
                          setPassword(e.target.value);
                        }}
                      />
                    </div>
                    <div class="md:ml-2">
                      <label
                        class="block mb-2 text-sm font-bold text-gray-700 dark:text-white"
                        for="c_password"
                      >
                        Confirm Password
                      </label>
                      <input
                        class="w-full px-3 py-2 mb-3 text-sm leading-tight text-gray-700 dark:text-white border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                        id="c_password"
                        type="password"
                        placeholder="******************"
                        value={c_password}
                        onChange={(e) => {
                          setC_password(e.target.value);
                        }}
                      />
                    </div>
                  </div>
                  <div class="mb-6 text-center">
                    <button
                      class="w-full px-4 py-2 font-bold text-white bg-blue-500 rounded-full hover:bg-blue-700 dark:bg-blue-700 dark:text-white dark:hover:bg-blue-900 focus:outline-none focus:shadow-outline"
                      type="button"
                      onClick={handleSubmit}
                    >
                      Register Account
                    </button>
                  </div>
                  <hr class="mb-6 border-t" />

                  <div class="text-center">
                    <Link
                      class="inline-block text-sm text-blue-500 dark:text-blue-500 align-baseline hover:text-blue-800"
                      to="/login"
                    >
                      Already have an account? Login!
                    </Link>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
