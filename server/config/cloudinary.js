import {v2 as cloudinary } from 'cloudinary'

const connectCloudinary = async() => {

cloudinary.config({
    // Support both correct and misspelled env var names
    cloud_name: process.env.CLOUDINARY_NAME || process.env.CLOUDNARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY || process.env.CLOUDNARY_API_KEY,
    api_secret: process.env.CLOUDINARY_SECRET || process.env.CLOUDNARY_SECRET

})
}

export default connectCloudinary
