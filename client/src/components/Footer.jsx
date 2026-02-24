import React from "react";
import { assets } from "../assets/assets";

const Footer = () => {
  return (
    <footer className="bg-gray-100 mt-20 border-t">
      <div className="container px-6 2xl:px-20 mx-auto flex flex-col md:flex-row items-center justify-between gap-6 py-6">
        
        {/* Logo */}
        <div className="flex items-center gap-2">
          <img width={160} src={assets.logo} alt="Job Portal Logo" className="cursor-pointer" />
        </div>

        {/* Links */}
        <nav className="flex flex-wrap justify-center gap-6 text-gray-600 font-medium">
          <a href="/" className="hover:text-blue-600 transition">Home</a>
          <a href="/jobs" className="hover:text-blue-600 transition">Jobs</a>
          <a href="/about" className="hover:text-blue-600 transition">About</a>
          <a href="/contact" className="hover:text-blue-600 transition">Contact</a>
        </nav>

        {/* Social Icons */}
        <div className="flex gap-4">
          <a href="" target="_blank" rel="noreferrer">
            <img
              width={32}
              src={assets.facebook_icon}
              alt="Facebook"
              className="hover:scale-110 transition-transform"
            />
          </a>
          <a href="" target="_blank" rel="noreferrer">
            <img
              width={32}
              src={assets.instagram_icon}
              alt="Instagram"
              className="hover:scale-110 transition-transform"
            />
          </a>
          <a href="" target="_blank" rel="noreferrer">
            <img
              width={32}
              src={assets.twitter_icon}
              alt="Twitter"
              className="hover:scale-110 transition-transform"
            />
          </a>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="text-center text-sm text-gray-500 py-4 border-t">
        © {new Date().getFullYear()} Job-Portal.dev | All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
