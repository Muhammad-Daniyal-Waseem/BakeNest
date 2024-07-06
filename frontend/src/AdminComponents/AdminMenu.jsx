import React from "react";
import DashboardImage from "./img/dashboard.png";
import ProductImage from "./img/add-product.png";
import OrderImage from "./img/order.png";
import LogoImage from "./img/Logo.png";
const AdminMenu = () => {
  const bar = () => {
    const barElement = document.getElementById("barmenu");
    const hamburger = document.getElementById("hamburger");
    if (barElement) {
      barElement.classList.toggle("hidden");
      hamburger.classList.toggle("hidden");
    }
  };

  return (
    <>
      <div
        id="hamburger"
        onClick={bar}
        class="hidden  mx-4 my-3  cursor-pointer z-50"
      >
        <i class="fa-solid fa-bars fa-lg"></i>
      </div>
      <div
        id="barmenu"
        className="fixed flex flex-col  bg-blue-500 lg:w-[10%] md:w-[20%] sm:w-[30%]  items-center z-50"
      >
        <div className="flex flex-col">
          <button className="backbutton" onClick={bar}>
            <div className="lg:hidden">
              <i className="fas fa-arrow-left fa-lg"></i>
            </div>
          </button>
          <div className=" md:size-12 lg:size-18 mt-6 p-5 ">
            <img src={LogoImage} alt="Dashboard" />
          </div>
        </div>
        <a href="/" className="flex flex-col justify-center items-center">
          <div className="size-12 mt-6 ">
            <img src={DashboardImage} alt="Dashboard" />
          </div>
          <div className="textcenter">DashBoard</div>
        </a>
        <a
          href="/ManageProducts"
          className="flex flex-col justify-center items-center"
        >
          <div className="size-14 mt-6">
            <img src={ProductImage} alt="Product" />
          </div>
          <div href="/ManageProducts" className="textcenter">
            Manage Products
          </div>
        </a>
        <a
          href="/ManageOrders"
          className="flex flex-col justify-center items-center mb-[50vh]"
        >
          <div className="size-10 mt-6">
            <img src={OrderImage} alt="Order" />
          </div>
          <div href="/ManageOrders" className="textcenter">
            Orders
          </div>
        </a>
      </div>
    </>
  );
};

export default AdminMenu;
