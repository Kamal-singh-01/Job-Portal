import React, { useEffect, useState, useContext } from 'react';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import { AppContext } from '../context/AppContext.jsx';
import { jobsData as dummyJobs } from '../assets/assets';

const ManageJob = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);       // ✅ always array
  const [loading, setLoading] = useState(true); // ✅ loading state
  const { backendUrl, companyToken } = useContext(AppContext);

  const fetchData = async () => {
    try {
      setLoading(true); // start loading
      const { data } = await axios.get(`${backendUrl}/api/company/list-job`, {
        headers: { Authorization: `Bearer ${companyToken}` },
      });

      if (data.success && Array.isArray(data.jobsData)) {
        if (data.jobsData.length > 0) {
          setJobs([...data.jobsData].reverse());
        } else {
          toast.info("No jobs found for this company");
          setJobs([]);
        }
      } else {
        toast.error("Invalid jobs data received");
        setJobs([]);
      }
    } catch (error) {
      toast.error(error.message);
      setJobs(dummyJobs);
    } finally {
      setLoading(false); // stop loading
    }
  };

  const changeVisibility = async (id) => {
    try {
      setLoading(true);
      const { data } = await axios.post(
        `${backendUrl}/api/company/change-visibility`,
        { id },
        { headers: { Authorization: `Bearer ${companyToken}` } }
      );

      if (data.success) {
        toast.success(data.message);
        fetchData();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (companyToken) {
      fetchData();
    }
  }, [companyToken]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-black"></div>
      </div>
    );
  }

  return (
    <div className="container p-4 max-w-5xl">
      <div className="overflow-x-auto">
        <table className="min-h-full border border-gray-200 bg-white max-sm:text-sm w-full">
          <thead className="border-b border-b-gray-300 bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left max-sm:hidden">#</th>
              <th className="px-4 py-2 text-left">Job Title</th>
              <th className="px-4 py-2 text-left max-sm:hidden">Date</th>
              <th className="px-4 py-2 text-left max-sm:hidden">Location</th>
              <th className="px-4 py-2 text-center">Applicants</th>
              <th className="px-4 py-2 text-center">Visible</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-300">
            {jobs.map((job, idx) => (
              <tr key={job._id || idx} className="text-gray-700">
                <td className="px-4 py-2 max-sm:hidden">{idx + 1}</td>
                <td className="px-4 py-2">{job.title}</td>
                <td className="px-4 py-2 max-sm:hidden">
                  {moment(job.date).format('ll')}
                </td>
                <td className="px-4 py-2 max-sm:hidden">{job.location}</td>
                <td className="px-4 py-2 text-center">
                  {job.applicants || 0}
                </td>
                <td className="px-4 py-2 text-center">
                  <input
                    type="checkbox"
                    className="scale-125"
                    checked={job.visible}
                    onChange={() => changeVisibility(job._id)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-5 flex justify-end">
        <button
          onClick={() => navigate('/dashboard/add-job')}
          className="bg-black text-white px-5 py-2 rounded-lg shadow hover:bg-blue-600 transition"
        >
          Add New Job
        </button>
      </div>
    </div>
  );
};

export default ManageJob;
