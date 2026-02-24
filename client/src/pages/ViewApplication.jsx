import React, { useContext, useEffect, useState } from 'react';
import { assets } from '../assets/assets';
import { AppContext } from '../context/AppContext.jsx';
import axios from 'axios';
import { toast } from 'react-toastify';

const ViewApplication = () => {
  const { backendUrl, companyToken } = useContext(AppContext);
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true); 

  // Fetch company job applicants data
  const fetchCompanyJobApplicants = async () => {
    try {
      setLoading(true); // start loading
      const { data } = await axios.get(`${backendUrl}/api/company/applicants`, {
        headers: { Authorization: `Bearer ${companyToken}` },
      });

      if (data.success) {
        setApplicants(data.applications.reverse());
      } else {
        toast.error(data.message);
        setApplicants([]);
      }
    } catch (error) {
      toast.error(error.message);
      setApplicants([]);
    } finally {
      setLoading(false); // stop loading
    }
  };

  const changeJobApplicationStatus = async (id, status) => {
    try {
      setLoading(true); // show loading while updating
      const { data } = await axios.post(
        `${backendUrl}/api/company/change-status`,
        { id, status },
        { headers: { Authorization: `Bearer ${companyToken}` } }
      );
      if (data.success) {
        fetchCompanyJobApplicants();
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
      fetchCompanyJobApplicants();
    }
  }, [companyToken]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-black"></div>
      </div>
    );
  }

  if (!loading && applicants.length === 0) {
    return <div className="p-4 text-center text-gray-500">No applicants yet</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="overflow-x-auto">
        <table className="w-full max-w-4xl border border-gray-300 max-sm:text-sm">
          <thead className="border-b border-b-gray-300 bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left">#</th>
              <th className="px-4 py-2 text-left">User name</th>
              <th className="px-4 py-2 text-left max-sm:hidden">Job Title</th>
              <th className="px-4 py-2 text-left max-sm:hidden">Location</th>
              <th className="px-4 py-2 text-left">Resume</th>
              <th className="px-4 py-2 text-left">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-300">
            {applicants
              .filter((item) => item.jobId && item.userId)
              .map((applicant, idx) => (
                <tr key={idx} className="text-gray-700">
                  <td className="px-4 py-2 text-center">{idx + 1}</td>
                  <td className="px-4 py-2 flex items-center">
                    <img
                      className="w-8 h-8 rounded-full mr-3 max-sm:hidden"
                      src={applicant.userId.image}
                      alt=""
                    />
                    <span>{applicant.userId.name}</span>
                  </td>
                  <td className="px-4 py-2 text-center max-sm:hidden">
                    {applicant.jobId.title}
                  </td>
                  <td className="px-4 py-2 text-center max-sm:hidden">
                    {applicant.jobId.location}
                  </td>
                  <td className="px-4 py-2">
                    <a
                      href={applicant.userId.resume}
                      target="_blank"
                      rel="noreferrer"
                      className="bg-blue-50 text-blue-400 px-3 py-1 rounded inline-flex items-center gap-2"
                    >
                      Resume
                      <img src={assets.resume_download_icon} alt="" />
                    </a>
                  </td>
                  <td className="px-4 py-2 relative">
                    {applicant.status === 'pending' ? (
                      <div className="relative inline text-left group">
                        <button className="text-gray-500 action-button">...</button>
                        <div className="absolute z-10 hidden right-0 md:left-0 top-0 mt-2 w-32 bg-white border border-gray-200 rounded shadow group-hover:block">
                          <button
                            onClick={() =>
                              changeJobApplicationStatus(applicant._id, 'Accepted')
                            }
                            className="block w-full text-left px-4 py-2 text-blue-500 hover:bg-gray-100"
                          >
                            Accept
                          </button>
                          <button
                            onClick={() =>
                              changeJobApplicationStatus(applicant._id, 'Rejected')
                            }
                            className="block w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100"
                          >
                            Reject
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div>{applicant.status}</div>
                    )}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ViewApplication;
