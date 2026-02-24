import React, { useContext } from "react";
import { assets } from "../assets/assets";
import { useClerk, UserButton, useUser } from "@clerk/clerk-react";
import { Link, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext.jsx";

const Navbar = () => {
  const { openSignIn } = useClerk();
  const { user } = useUser();
  const navigate = useNavigate();
  const {setShowRecrutierLogin} = useContext(AppContext)

  return (
    <div className="shadow py-4">
      <div className="container px-4 2xl:px-20 mx-auto flex justify-between items-center">
        <img onClick={() => navigate('/')} className="cursor-pointer" src={assets.logo} alt="" />
        {user ? (
          <div className="flex gap-2 items-center ">

            <Link className="hover:font-bold" to={"/application"}>Applied Job</Link>
            <p>|</p>
            <p className="max-sm:hidden">Hi, {user.firstName +" "+ user.lastName}</p>
            
               <UserButton  />

            
           

          </div>
        ) : (
          <div className="flex gap-4 max-sm:text-xs">
            <button onClick={e => setShowRecrutierLogin(true)} className="text-gray-600 cursor-pointer">Recruiter Login</button>
            <button
              onClick={() => openSignIn()}
              className="bg-blue-600 text-white px-6 sm:px-9 rounded-full py-2"
            >
              Login
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
