import React, { useEffect } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import { useContext } from "react";
import { AppContext } from "../context/AppContext.jsx";


const Dashboard = () => {
  const navigate = useNavigate();
  const {companyData,setCompanyData, setCompanyToken} = useContext(AppContext)

  const logout = async() => {
    setCompanyToken(null)
    localStorage.removeItem('companyToken')
    setCompanyData(null)
    navigate('/')

  }
  useEffect(() => {
      if(companyData){
        navigate('/dashboard/manage-job')
      }
  },[companyData])

  return (
    <div className="min-h-screen">
      {/* Top Navbar */}
      <div className="shadow py-4">
        <div className="flex justify-between items-center">
          <img
            onClick={() => navigate("/")}
            className="cursor-pointer max-sm:w-32"
            src={assets.logo}
            alt="logo"
          />
         
               <div className="flex items-center gap-3">
            <p className="max-sm:hidden">Welcome! {companyData.name}</p>

            <div className="relative group ml-2 mr-4">
              <img
                className="w-8 rounded-full cursor-pointer"
                src={companyData.image}
                alt="profile"
              />
              <div className="absolute hidden group-hover:block top-0 right-4 z-10 text-black rounded pt-12">
                <ul className="list-none border border-gray-200 bg-gray-50 m-0 p-2 rounded-md text-sm">
                  <li onClick={logout} className="px-2 py-1 cursor-pointer pr-5">Logout</li>
                </ul>
              </div>
            </div>
          </div>
         
        </div>
      </div>

      {/* Layout */}
      <div className="flex items-start">
        {/* Sidebar */}
        <div className="inline-block min-h-screen border-r-2 border-gray-200">
          <ul className="flex flex-col items-start pt-5 text-gray-800">
            <NavLink
              to="/dashboard/add-job"
               className={({ isActive }) =>
                `flex items-center p-3 sm:px-6 gap-2 w-full hover:bg-gray-200 ${
                  isActive ? "bg-blue-500 text-white rounded" : ""
                }`
              }
            >
              <img className="min-w-4" src={assets.add_icon} alt="" />
              <p className="max-sm:hidden">Add Job</p>
            </NavLink>

            <NavLink
              to="/dashboard/manage-job"
               className={({ isActive }) =>
                `flex items-center p-3 sm:px-6 gap-2 w-full hover:bg-gray-200 ${
                  isActive ? "bg-blue-500 text-white rounded" : ""
                }`
              }
            >
              <img className="min-w-4" src={assets.home_icon} alt="" />
              <p className="max-sm:hidden">Manage Job</p>
            </NavLink>

            <NavLink
              to="/dashboard/view-application"
             className={({ isActive }) =>
                `flex items-center p-3 sm:px-6 gap-2 w-full hover:bg-gray-200 ${
                  isActive ? "bg-blue-500 text-white rounded" : ""
                }`
              }
            >
              <img className="min-w-4" src={assets.person_tick_icon} alt="" />
              <p className="max-sm:hidden">View Application</p>
            </NavLink>
          </ul>
        </div>

        {/* Main content (renders nested routes here) */}
        <div className="flex-1 p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
