import React, { useRef, useState } from "react";
import Slider from "react-slick";

export default function Carousel() {
  let sliderRef = useRef(null);
  const [isTextVisible, setIsTextVisible] = useState(true);

  const next = () => {
    setIsTextVisible(false);
    sliderRef.current.slickNext();
  };

  const previous = () => {
    setIsTextVisible(false);
    sliderRef.current.slickPrev();
  };

  var settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    fade: true,
    autoplay: true,
    autoplaySpeed: 5000,
    className: "overflow-hidden relative",
    beforeChange: () => {
      setIsTextVisible(false);
    },
    afterChange: () => {
      setIsTextVisible(true);
    },
  };

  return (
    <>
      <div className="relative">
        <Slider ref={(slider) => (sliderRef.current = slider)} {...settings}>
          <div>
            <img
              className="object-cover h-80 w-full"
              src="slider-1.jpg"
              alt=""
            />
            <div
              className={`absolute top-1/4 left-1/3 w-2/5 mx-auto text-white fadeinLeft ${
                isTextVisible ? "visible" : ""
              }`}
            >
              <p className="text-sm lg:text-lg mb-4 workSans fadein">
                We specialize in Bakery Products
              </p>
              <h2 className="text-md lg:text-2xl font-bold mb-2 text-gray-100 workSans fadein">
                Wanna Bake Some Delicious Muffins!
              </h2>
              <button className="bg-gray-200 px-4 py-2 rounded-sm text-black text-sm lg:text-md font-bold workSans hover:bg-gray-400">
                Shop Now
              </button>
            </div>
          </div>
          <div>
            <img
              className="object-cover h-80 w-full"
              src="slider-2.png"
              alt=""
            />
            <div
              className={`absolute top-1/4 left-1/3 w-2/5 mx-auto text-white fadeinTop ${
                isTextVisible ? "visible" : ""
              }`}
            >
              <p className="text-sm lg:text-lg mb-4 workSans">
                We recently added Chicken Patties
              </p>
              <h2 className="text-md lg:text-2xl font-bold mb-2 text-gray-100 workSans">
                Dalda Puffs Patties!
              </h2>
              <button className="bg-gray-200 px-4 py-2 rounded-sm text-black text-sm lg:text-md font-bold workSans hover:bg-gray-400">
                Shop Now
              </button>
            </div>
          </div>
          <div>
            <img
              className="object-cover h-80 w-full"
              src="slider-3.png"
              alt=""
            />
            <div
              className={`absolute top-1/4 left-1/3 w-2/5 mx-auto text-white fadeinRight ${
                isTextVisible ? "visible" : ""
              }`}
            >
              <p className="text-sm lg:text-lg mb-4 workSans">
                Discover Our Freshly Baked Breads
              </p>
              <h2 className="text-md lg:text-2xl font-bold mb-2 text-gray-100 workSans">
                Artisanal Breads for Every Taste
              </h2>
              <button className="bg-gray-200 px-4 py-2 rounded-sm text-black text-sm lg:text-md font-bold workSans hover:bg-gray-400">
                Shop Now
              </button>
            </div>
          </div>
        </Slider>
        <div className="absolute top-1/2 left-5 transform -translate-y-1/2 bg-slate-300 opacity-30 hover:opacity-100 transition-opacity duration-300">
          <button
            className="flex justify-center align-middle"
            onClick={previous}
          >
            <img className="h-4 lg:h-7 m-2" src="prev.png" alt="" />
          </button>
        </div>
        <div className="absolute top-1/2 right-5 transform -translate-y-1/2 bg-slate-300 opacity-30 hover:opacity-100 transition-opacity duration-300">
          <button className="flex justify-center align-middle" onClick={next}>
            <img className="h-4 lg:h-7 m-2" src="next.png" alt="" />
          </button>
        </div>
      </div>
    </>
  );
}
