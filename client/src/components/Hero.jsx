import React, { useContext, useRef } from "react";
import { assets } from "../assets/assets";
import { AppContext } from "../context/AppContext.jsx";

const Hero = () => {
  const { setIsSearched, setSearchFilter } = useContext(AppContext);
  const titleRef = useRef(null);
  const locationRef = useRef(null);

  const onSearch = () => {
    const searchData = {
      title: titleRef.current.value,
      location: locationRef.current.value,
    };

    console.log("Hero onSearch called with:", searchData);
    setSearchFilter(searchData);
    setIsSearched(true);

    console.log("Search Data:", searchData);
  };

  return (
    <div className="container 2xl:px-20 mx-auto my-10">
      <div className="bg-gradient-to-br from-purple-800 to-purple-950 text-white text-center py-16 mx-2 rounded-xl">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-medium mb-4">
          Over 10,000+ jobs to apply
        </h2>
        <p className="mb-8 max-w-xl mx-auto font-light px-5 text-sm">
          Your Next Career Moves Right Here. Explore The Best Job Opportunities
          and Take the First Step Toward Your Future
        </p>

        <div className="flex items-center justify-between bg-white rounded text-gray-600 max-w-xl pl-4 mx-4 sm:mx-auto">
          {/* Job Title Search */}
          <div className="flex items-center">
            <img className="h-4 sm:h-5" src={assets.search_icon} alt="search" />
            <input
              className="w-full bg-transparent text-sm sm:text-base p-1 outline-none placeholder-gray-900 focus:placeholder-gray-300"
              type="text"
              placeholder="Search for job"
              ref={titleRef}
            />
          </div>

          {/* Location Search */}
          <div className="flex items-center gap-2 bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 shadow-sm focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition">
            <img
              className="h-4 sm:h-5 opacity-70"
              src={assets.location_icon}
              alt="location"
            />
            <input
              className="w-full bg-transparent text-sm sm:text-base p-1 outline-none placeholder-gray-900 focus:placeholder-gray-300"
              type="text"
              placeholder="Location"
              ref={locationRef}
            />
          </div>

          {/* Search Button */}
          <button
            onClick={onSearch}
            className="bg-blue-600 rounded outline-none px-6 py-3 text-white m-1 hover:bg-blue-700 transition"
          >
            Search
          </button>
        </div>
      </div>

      {/* Trusted By Section */}
      <div className="border border-gray-300 shadow-md mx-2 mt-5 p-6 rounded-md">
        <div className="flex justify-between items-center flex-wrap gap-3">
          <p className="font-medium">Trusted By</p>
          <img className="h-6" src={assets.microsoft_logo} alt="Microsoft" />
          <img className="h-6" src={assets.walmart_logo} alt="Walmart" />
          <img className="h-6" src={assets.accenture_logo} alt="Accenture" />
          <img className="h-6" src={assets.samsung_logo} alt="Samsung" />
          <img className="h-6" src={assets.amazon_logo} alt="Amazon" />
          <img className="h-6" src={assets.adobe_logo} alt="Adobe" />
        </div>
      </div>
    </div>
  );
};

export default Hero;
