import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext.jsx";
import { assets, JobCategories, JobLocations } from "../assets/assets";
import JobCard from "./JobCard";

const JobListing = () => {  
  const { isSearched, searchFilter, setSearchFilter, job } = useContext(AppContext);
  const [showFilter, setShowFilter] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState([]);
  const [filteredJob, setFilteredJob] = useState([]);

  // handle category filter
  const handleCategoryChange = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  // handle location filter
  const handleLocationChange = (location) => {
    setSelectedLocation((prev) =>
      prev.includes(location)
        ? prev.filter((l) => l !== location)
        : [...prev, location]
    );
  };

  // filtering logic
  useEffect(() => {
    if (!job || job.length === 0) return;
    
    console.log("Filtering jobs...");
    console.log("Search filter:", searchFilter);
    console.log("Total jobs:", job.length);
    
    const matchCategory = (job) =>
      selectedCategories.length === 0 || selectedCategories.includes(job.category);

    const matchLocation = (job) =>
      selectedLocation.length === 0 || selectedLocation.includes(job.location);

    const matchedTitle = (job) => {
      const result = searchFilter.title === "" ||
        job.title.toLowerCase().includes(searchFilter.title.toLowerCase()) ||
        job.category.toLowerCase().includes(searchFilter.title.toLowerCase());
      console.log(`Job "${job.title}" (category: ${job.category}) matches "${searchFilter.title}": ${result}`);
      return result;
    };

    const matchSearchLocation = (job) =>
      searchFilter.location === "" ||
      job.location.toLowerCase().includes(searchFilter.location.toLowerCase());
    
    const newFilterJobs = job
      .slice()
      .reverse()
      .filter(
        (job) => {
          const categoryMatch = matchCategory(job);
          const locationMatch = matchLocation(job);
          const titleMatch = matchedTitle(job);
          const searchLocationMatch = matchSearchLocation(job);
          
          return categoryMatch && locationMatch && titleMatch && searchLocationMatch;
        }
      );

    console.log("Filtered jobs count:", newFilterJobs.length);
    setFilteredJob(newFilterJobs);
    setCurrentPage(1); // reset to page 1 when filters change
  }, [job, selectedCategories, selectedLocation, searchFilter]);

  return (
    <div className="container 2xl:px-20 mx-auto flex flex-col lg:flex-row max-lg:space-y-8 py-8">
      {/* Sidebar Filters */}
      <div className="w-full lg:w-1/4 bg-white px-4">
        {/* Current Search */}
        {isSearched &&
          (searchFilter.title !== "" || searchFilter.location !== "") && (
            <>
              <h3 className="font-medium text-lg mb-4">Current Search</h3>
              <div className="mb-4 text-gray-600">
                {searchFilter.title && (
                  <span className="inline-flex gap-2.5 items-center bg-blue-200 border border-blue-200 px-4 py-1.5 rounded">
                    {searchFilter.title}
                    <img
                      onClick={() =>
                        setSearchFilter((prev) => ({ ...prev, title: "" }))
                      }
                      className="cursor-pointer"
                      src={assets.cross_icon}
                      alt=""
                    />
                  </span>
                )}
                {searchFilter.location && (
                  <span className="ml-2 inline-flex gap-2.5 items-center bg-red-200 border border-blue-200 px-4 py-1.5 rounded">
                    {searchFilter.location}
                    <img
                      onClick={() =>
                        setSearchFilter((prev) => ({ ...prev, location: "" }))
                      }
                      className="cursor-pointer"
                      src={assets.cross_icon}
                      alt=""
                    />
                  </span>
                )}
              </div>
            </>
          )}

        {/* Toggle Button for Mobile */}
        <button
          onClick={() => setShowFilter((prev) => !prev)}
          className="border bg-blue-600 text-white rounded px-3 py-1.5 text-sm lg:hidden"
        >
          {showFilter ? "Close" : "Filter"}
        </button>

        {/* Category Filter */}
        <div className={showFilter ? "" : "max-lg:hidden"}>
          <h3 className="font-medium text-lg py-4">Search for categories</h3>
          <ul className="text-gray-600 space-y-4">
            {JobCategories.map((category, idx) => (
              <li
                className="flex items-center gap-3 hover:text-blue-500"
                key={idx}
              >
                <input
                  className="scale-125"
                  type="checkbox"
                  onChange={() => handleCategoryChange(category)}
                  checked={selectedCategories.includes(category)}
                />
                {category}
              </li>
            ))}
          </ul>
        </div>

        {/* Location Filter */}
        <div className={showFilter ? "" : "max-lg:hidden mt-10"}>
          <h3 className="font-medium text-lg py-4">Search for Location</h3>
          <ul className="text-gray-600 space-y-4">
            {JobLocations.map((location, idx) => (
              <li
                className="flex items-center gap-3 hover:text-blue-500"
                key={idx}
              >
                <input
                  className="scale-125"
                  type="checkbox"
                  onChange={() => handleLocationChange(location)}
                  checked={selectedLocation.includes(location)}
                />
                {location}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Job Listing Section */}
      <section className="w-full lg:w-3/4 text-gray-800 max-lg:px-4">
        <h3 className="font-medium text-3xl py-2" id="jobList">
          Latest Job
        </h3>
        <p>Get Your desire Job from top Company</p>

        {/* Jobs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredJob
            .slice((currentPage - 1) * 6, currentPage * 6)
            .map((job, idx) => (
              <JobCard key={idx} job={job} />
            ))}
        </div>

        {/* Pagination */}
        {filteredJob.length > 0 && (
          <div className="flex items-center justify-center mt-10 space-x-3">
            {/* Previous */}
            <a href="#jobList">
              <img
                onClick={() =>
                  setCurrentPage((prev) => Math.max(prev - 1, 1))
                }
                src={assets.left_arrow_icon}
                alt=""
              />
            </a>

            {/* Page Numbers */}
            {Array.from({ length: Math.ceil(filteredJob.length / 6) }).map(
              (_, idx) => (
                <a href="#jobList" key={idx}>
                  <button
                    onClick={() => setCurrentPage(idx + 1)}
                    className={`border w-10 h-10 flex justify-center items-center border-gray-300 font-medium text-sm rounded ${
                      currentPage === idx + 1
                        ? "bg-blue-600 text-white"
                        : "bg-gray-300"
                    }`}
                  >
                    {idx + 1}
                  </button>
                </a>
              )
            )}

            {/* Next */}
            <a href="#jobList">
              <img
                onClick={() =>
                  setCurrentPage((prev) =>
                    Math.min(prev + 1, Math.ceil(filteredJob.length / 6))
                  )
                }
                src={assets.right_arrow_icon}
                alt=""
              />
            </a>
          </div>
        )}
      </section>
    </div>
  );
};

export default JobListing;
