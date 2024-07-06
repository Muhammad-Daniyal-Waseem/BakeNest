import React, { createContext, useState } from "react";

const UserContext = createContext();

const UserProvider = (props) => {
  const host = "http://localhost:3000";

  const login = async (formData) => {
    const response = await fetch(`${host}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      console.log(response.error)
      throw "Something went wrong";
    } else {
      const responseData = await response.json(); 
      const { token, user } = responseData;

      localStorage.clear();
      localStorage.setItem("auth-token", token);

      return {token, user};
    }
  };

  const [cartCount, setCartCount] = useState(0);

  return (
    <UserContext.Provider value={{ login, host, cartCount, setCartCount }}>
      {props.children}
    </UserContext.Provider>
  );
};

export { UserContext, UserProvider };
