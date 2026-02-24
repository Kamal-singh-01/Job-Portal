import React from 'react'
import { assets } from '../assets/assets'

const AppDownload = () => {
  return (
    <div className=" w-full px-4 py-12 sm:px-6 md:px-12 bg-gradient-to-b from-gray-50 to-gray-100 rounded-2xl shadow-lg">
      <div className="flex flex-col-reverse md:flex-row items-center justify-between gap-8">
        
        {/* Left Content */}
        <div className=" ml-20 text-center md:text-left max-w-lg">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 leading-snug">
            Download App For <br className="hidden sm:block" /> Better Experience
          </h2>
          <p className="mt-3 sm:mt-4 text-gray-600 text-sm sm:text-base md:text-lg">
            Get our mobile app for faster, easier, and smarter access anytime, anywhere.
          </p>

          {/* Store Buttons */}
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 sm:gap-4 mt-6">
            <img
              className="h-10 sm:h-12 md:h-14 cursor-pointer hover:scale-105 transition-transform duration-300"
              src={assets.play_store}
              alt="Play Store"
            />
            <img
              className="h-10 sm:h-12 md:h-14 cursor-pointer hover:scale-105 transition-transform duration-300"
              src={assets.app_store}
              alt="App Store"
            />
          </div>
        </div>

        {/* Right App Image */}
        <div className="flex justify-center md:justify-end max-lg:hidden">
          <img
            className="h-52  md:h-72 lg:h-80 drop-shadow-xl"
            src={assets.app_main_img}
            alt="App Preview"
          />
        </div>
      </div>
    </div>
  )
}

export default AppDownload
