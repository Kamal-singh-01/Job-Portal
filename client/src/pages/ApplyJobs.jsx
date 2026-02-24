import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar.jsx";
import Loading from "../components/Loading.jsx";
import { assets } from "../assets/assets";
import kconvert from "k-convert";
import moment from "moment";
import JobCard from "../components/JobCard.jsx";
import Footer from "../components/Footer.jsx";
import { AppContext } from "../context/AppContext.jsx";
import { toast } from "react-toastify";
import { useAuth } from "@clerk/clerk-react";

const ApplyJobs = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [jobdata, setJobdata] = useState(null);
  const [moreJobs, setMoreJobs] = useState([]);
  const [loading, setLoading] = useState(true); 
  const [applyLoading, setApplyLoading] = useState(false);
  const [isApplied, setIsApplied] = useState(false);

  const { backendUrl, userData, userDataApplications, fetchUserApplication } = useContext(AppContext);
  const { getToken } = useAuth();

  const fetchJob = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${backendUrl}/api/jobs/${id}`);
      if (data.success) {
        setJobdata(data.job);

        // fetch related jobs
        const allJobsRes = await axios.get(`${backendUrl}/api/jobs`);
        if (allJobsRes.data.success) {
          const allJobs = allJobsRes.data.jobs;
          const jobCompanyId = typeof data.job.companyId === "object" ? data.job.companyId._id : data.job.companyId;

          const related = allJobs
            .filter((j) => j._id !== data.job._id)
            .filter((j) => (typeof j.companyId === "object" ? j.companyId._id : j.companyId) === jobCompanyId)
            .slice(0, 4);

          setMoreJobs(related);
        }
      }
    } catch (err) {
      console.error("Error fetching job:", err);
    } finally {
      setLoading(false);
    }
  };

  const applyHandler = async () => {
    try {
      if (!userData) return toast.error("Login to apply for a job");
      if (!userData.resume) {
        navigate("/application");
        return toast.error("Upload resume to apply");
      }

      setApplyLoading(true); // ✅ start loading for apply button

      const token = await getToken();
      if (!token) {
        setApplyLoading(false);
        return toast.error("Not authenticated");
      }

      const { data } = await axios.post(
        `${backendUrl}/api/users/apply`,
        { jobId: jobdata._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {
        toast.success(data.message || "Applied successfully");
        setIsApplied(true);
        fetchUserApplication(); // update applications list
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || "Something went wrong");
    } finally {
      setApplyLoading(false); // ✅ stop loading
    }
  };

  const checkAlreadyApplied = () => {
    const hasApplied = userDataApplications.some((item) => item.jobId._id === jobdata._id);
    setIsApplied(hasApplied);
  };

  useEffect(() => {
    fetchJob();
  }, [id]);

  useEffect(() => {
    if (userDataApplications.length > 0 && jobdata) {
      checkAlreadyApplied();
    }
  }, [jobdata, userDataApplications]);

  if (loading) return <Loading />;
  if (!jobdata) return <p className="text-center mt-10">Job not found</p>;

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex flex-col container py-10 px-4 2xl:px-20 mx-auto">
        <div className="bg-white text-black rounded-full w-full">
          {/* Header Section */}
          <div className="flex justify-center md:justify-between flex-wrap gap-8 px-14 py-20 border border-sky-400 bg-sky-100 rounded-xl">
            <div className="flex flex-col md:flex-row items-center">
              <img
                className="h-24 bg-white rounded-lg border border-white p-4 mr-4 max-md:mb-4"
                src={typeof jobdata.companyId === "object" ? jobdata.companyId.image : assets.company_icon}
                alt=""
              />
              <div className="text-center md:text-left text-neutral-700">
                <h1 className="text-2xl sm:text-4xl font-medium">{jobdata.title}</h1>
                <div className="flex flex-row flex-wrap max-md:justify-center gap-y-2 gap-6 items-center text-gray-600 mt-2">
                  <span className="flex items-center gap-1">
                    <img src={assets.suitcase_icon} alt="" />
                    {typeof jobdata.companyId === "object" ? jobdata.companyId.name : "Unknown Company"}
                  </span>
                  <span className="flex items-center gap-1">
                    <img src={assets.location_icon} alt="" />
                    {jobdata.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <img src={assets.person_icon} alt="" />
                    {jobdata.level}
                  </span>
                  <span className="flex items-center gap-1">
                    <img src={assets.money_icon} alt="" />
                    CTC: ${kconvert.convertTo(jobdata.salary)}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex-col mt-7 justify-center text-end text-sm max-md:mx-auto max-md:text-center">
              <button
                onClick={applyHandler}
                disabled={isApplied || applyLoading} // disable if already applied or loading
                className="border bg-blue-600 px-7 py-2 text-white rounded flex justify-center items-center gap-2"
              >
                {applyLoading ? (
                  <div className="animate-spin h-5 w-5 border-b-2 border-white rounded-full"></div>
                ) : isApplied ? "Already Applied" : "Apply now"}
              </button>
              <p className="text-gray-800 text-sm mt-2">Posted {moment(jobdata.date).fromNow()}</p>
            </div>
          </div>

          {/* Job Description & Related Jobs */}
          <div className="flex flex-col lg:flex-row justify-between items-start mt-5">
            <div className="w-full lg:w-2/3">
              <h2 className="text-2xl sm:4xl font-bold mb-4">Job Description</h2>
              <div className="rich-text" dangerouslySetInnerHTML={{ __html: jobdata.description }}></div>
              <button
                onClick={applyHandler}
                disabled={isApplied || applyLoading}
                className="border bg-blue-600 px-7 py-2 text-white rounded mt-5 flex justify-center items-center gap-2"
              >
                {applyLoading ? <div className="animate-spin h-5 w-5 border-b-2 border-white rounded-full"></div> : isApplied ? "Already Applied" : "Apply now"}
              </button>
            </div>

            <div className="w-full lg:w-1/3 mt-8 lg:mt-0 lg:ml-8 space-y-5">
              <h2>
                More Jobs from {typeof jobdata.companyId === "object" ? jobdata.companyId.name : "this company"}
              </h2>

              {moreJobs
                .filter((j) => !userDataApplications.some((app) => String(app.jobId?._id) === String(j._id)))
                .slice(0, 4)
                .map((j, idx) => (
                  <JobCard key={idx} job={j} />
                ))}

              {moreJobs.filter((j) => !userDataApplications.some((app) => String(app.jobId?._id) === String(j._id))).length === 0 && (
                <p className="text-gray-500">No related jobs found.</p>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ApplyJobs;
