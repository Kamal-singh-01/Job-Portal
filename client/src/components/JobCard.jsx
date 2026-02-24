import React from 'react'
import { assets } from '../assets/assets'
import {useNavigate} from 'react-router-dom'

const JobCard = ({ job }) => {
  const navigate = useNavigate();
  return (
    <div className=" mt-5 border border-gray-200 rounded-lg shadow-md p-4 bg-white hover:shadow-lg transition-shadow duration-300">
      <div className='flex justify-between  items-center'>
<img
  className="h-6"
  src={
    typeof job.companyId === "object"
      ? job.companyId.image   // use image, not img
      : assets.company_icon   // fallback if it's only an ID
  }
  alt="Company Logo"
/>
      </div>
      <h4 className='font-medium text-xl'>{job.title}</h4>
      <div className='mt-2 flex items-center gap-3 text-xs'>
        <span className=' border  border-blue-200 bg-blue-50 rounded py-1.5 px-4'>{job.location}</span>
         <span className='border  border-red-200 bg-red-50 rounded py-1.5 px-4' >{job.level}</span>
      </div>
      <p className='text-gray-500 text-sm mt-4' dangerouslySetInnerHTML={{__html:job.description.slice(0,150)}}></p>
      <div className='flex items- mt-4 gap-3 text-sm'>
        <button onClick = {() =>{navigate(`/apply-job/${job._id}`); scrollTo(0,0)}} className=' border bg-blue-600 text-white rounded px-3 py-1.5'>Apply Now</button>
        <button className='border text-gray-500 border-gray-500 rounded px-3 py-1.5'>Learn More</button>
      </div>
    </div>
    
  )
}

export default JobCard
