import React, {useState, useContext, useEffect} from "react";
import { ProductContext } from "../context/ProductContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { UserContext } from "../context/UserContext";

export default function ProductCard(props) {
  const { host } = useContext(UserContext);

  const navigate = useNavigate();
  const {setObject} = useContext(ProductContext);
  const [check,setchecker]=useState(true);

  const handleClick = async() => {
      const token = localStorage.getItem("auth-token");
      // if (!token) {
      //   // Handle unauthorized user
      //   navigate('/login');
      //   return;
      // }
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
          console.log("response.data.Admin ",response.data.Admin);
          if(response.data.Admin)
            {
              navigate("/admin");
              return;
            }
            setchecker(false);
        
        } catch (error) {
          console.error(error);
          // Handle error
        }
  

    setObject({
      "productId" : props.id,
      "image": props.image,
      "name" : props.name,
      "description" : props.description,
      "price" : props.price,
      "rating" : props.rating,
      "productQuantity": props.quantity
    });
    navigate("/productDetail");
  };

  return (
    check && (
    <div
      className="rounded overflow-hidden shadow-lg flex flex-col m-2"
      onClick={handleClick}
    >
      <a href="#"></a>
      <div className="relative">
          <img
            className="w-[300px] h-[200px] object-cover"
            src={props.image}
            alt="Sunset in the mountains"
          />
          <div className="hover:bg-transparent transition duration-300 absolute bottom-0 top-0 right-0 left-0 bg-gray-900 opacity-25"></div>
          <div className="text-xs absolute top-0 right-0 bg-indigo-600 px-4 py-2 text-white mt-3 mr-3 hover:bg-white hover:text-indigo-600 transition duration-500 ease-in-out">
            Cooking
          </div>
      </div>
      <div className="px-6 py-4 mb-auto">
        <span
          className="font-medium text-lg inline-block hover:text-indigo-600 transition duration-500 ease-in-out mb-2"
        >
          {props.name}
        </span>
        <p className="text-gray-500 text-sm">{props.description}</p>
      </div>
      <div className="px-6 py-3 flex flex-row items-center justify-between bg-gray-100">
        <span
          className="py-1 text-xs font-regular text-gray-900 mr-1 flex flex-row items-center"
        >
          <img src="/star.svg" alt="PKR Icon" className="w-5" />
          <span className="ml-1 text-lg">{ Math.floor(props.rating * 10) / 10}</span>
        </span>

        <span
          className="py-1 text-xs font-regular text-gray-900 mr-1 flex flex-row items-center"
        >
          <img src="/pkr.svg" alt="PKR Icon" className="w-5" />
          <span className="ml-1 text-xl font-bold">{props.price}</span>
        </span>
      </div>
    </div>)
  );
}
