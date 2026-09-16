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

  const { backendUrl, userData, userDataApplications, fetchUserApplication } =
    useContext(AppContext);
  const { getToken } = useAuth();

  const [showResumeOptions, setShowResumeOptions] = useState(false);
  const [selectedResume, setSelectedResume] = useState("existing");
  const [newResume, setNewResume] = useState(null);

  const [parsedResume, setParsedResume] = useState(null);
  const [jobAnalysis, setJobAnalysis] = useState(null);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [analysisLoading, setAnalysisLoading] = useState(false);

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
          const jobCompanyId =
            typeof data.job.companyId === "object"
              ? data.job.companyId._id
              : data.job.companyId;

          const related = allJobs
            .filter((j) => j._id !== data.job._id)
            .filter(
              (j) =>
                (typeof j.companyId === "object"
                  ? j.companyId._id
                  : j.companyId) === jobCompanyId,
            )
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
      if (!userData) {
        return toast.error("Login to apply for a job");
      }

      if (isApplied) {
        return;
      }

      if (!userData.resume) {
        setSelectedResume("new");
      } else {
        setSelectedResume("existing");
      }

      setShowResumeOptions(true);
    } catch (error) {
      console.error("Resume analysis error:", error);

      toast.error(
        error.response?.data?.message ||
          "AI analysis is temporarily unavailable. Please try again.",
      );
    }
  };

  const submitApplication = async () => {
    try {
      if (selectedResume === "new" && !newResume) {
        return toast.error("Please select a resume");
      }

      setApplyLoading(true);

      const token = await getToken();

      if (!token) {
        return toast.error("Not authenticated");
      }

      const formData = new FormData();

      formData.append("jobId", jobdata._id);

      if (selectedResume === "new") {
        formData.append("resume", newResume);
      }

      const { data } = await axios.post(
        `${backendUrl}/api/users/apply`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (data.success) {
        toast.success(data.message || "Applied successfully");

        setIsApplied(true);
        setShowAnalysis(false);
        setShowResumeOptions(false);

        setNewResume(null);
        setParsedResume(null);
        setJobAnalysis(null);

        fetchUserApplication();
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Something went wrong",
      );
    } finally {
      setApplyLoading(false);
    }
  };

  const checkAlreadyApplied = () => {
    const hasApplied = userDataApplications.some(
      (item) => item.jobId._id === jobdata._id,
    );
    setIsApplied(hasApplied);
  };

  const analyzeResume = async () => {
    try {
      if (selectedResume === "new" && !newResume) {
        return toast.error("Please select a resume");
      }

      setAnalysisLoading(true);

      const token = await getToken();

      if (!token) {
        return toast.error("Not authenticated");
      }

      let resumeData;

      // =========================
      // NEW RESUME
      // =========================
      if (selectedResume === "new") {
        const formData = new FormData();

        formData.append("resume", newResume);

        const { data } = await axios.post(
          `${backendUrl}/api/resume/parse`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (!data.success) {
          throw new Error(data.message || "Resume parsing failed");
        }

        resumeData = data.resume;
      }

      // =========================
      // EXISTING RESUME
      // =========================
      // We'll handle this separately below.
      if (selectedResume === "existing") {
        toast.info("Existing resume analysis will be connected next.");
        return;
      }

      setParsedResume(resumeData);

      // =========================
      // JOB MATCH ANALYSIS
      // =========================

      const { data: analysisData } = await axios.post(
        `${backendUrl}/api/resume/job-match`,
        {
          parsedResume: resumeData,
          jobDescription: jobdata.description,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      if (!analysisData.success) {
        throw new Error(analysisData.message || "Job analysis failed");
      }

      setJobAnalysis(analysisData.analysis);

      setShowResumeOptions(false);
      setShowAnalysis(true);
    } catch (error) {
      console.error("Resume analysis error:", error);

      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Failed to analyze resume",
      );
    } finally {
      setAnalysisLoading(false);
    }
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
                src={
                  typeof jobdata.companyId === "object"
                    ? jobdata.companyId.image
                    : assets.company_icon
                }
                alt=""
              />
              <div className="text-center md:text-left text-neutral-700">
                <h1 className="text-2xl sm:text-4xl font-medium">
                  {jobdata.title}
                </h1>
                <div className="flex flex-row flex-wrap max-md:justify-center gap-y-2 gap-6 items-center text-gray-600 mt-2">
                  <span className="flex items-center gap-1">
                    <img src={assets.suitcase_icon} alt="" />
                    {typeof jobdata.companyId === "object"
                      ? jobdata.companyId.name
                      : "Unknown Company"}
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
                ) : isApplied ? (
                  "Already Applied"
                ) : (
                  "Apply now"
                )}
              </button>
              <p className="text-gray-800 text-sm mt-2">
                Posted {moment(jobdata.date).fromNow()}
              </p>
            </div>
          </div>

          {/* Job Description & Related Jobs */}
          <div className="flex flex-col lg:flex-row justify-between items-start mt-5">
            <div className="w-full lg:w-2/3">
              <h2 className="text-2xl sm:4xl font-bold mb-4">
                Job Description
              </h2>
              <div
                className="rich-text"
                dangerouslySetInnerHTML={{ __html: jobdata.description }}
              ></div>
              <button
                onClick={applyHandler}
                disabled={isApplied || applyLoading}
                className="border bg-blue-600 px-7 py-2 text-white rounded mt-5 flex justify-center items-center gap-2"
              >
                {applyLoading ? (
                  <div className="animate-spin h-5 w-5 border-b-2 border-white rounded-full"></div>
                ) : isApplied ? (
                  "Already Applied"
                ) : (
                  "Apply now"
                )}
              </button>
            </div>

            <div className="w-full lg:w-1/3 mt-8 lg:mt-0 lg:ml-8 space-y-5">
              <h2>
                More Jobs from{" "}
                {typeof jobdata.companyId === "object"
                  ? jobdata.companyId.name
                  : "this company"}
              </h2>

              {moreJobs
                .filter(
                  (j) =>
                    !userDataApplications.some(
                      (app) => String(app.jobId?._id) === String(j._id),
                    ),
                )
                .slice(0, 4)
                .map((j, idx) => (
                  <JobCard key={idx} job={j} />
                ))}

              {moreJobs.filter(
                (j) =>
                  !userDataApplications.some(
                    (app) => String(app.jobId?._id) === String(j._id),
                  ),
              ).length === 0 && (
                <p className="text-gray-500">No related jobs found.</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {showResumeOptions && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
            <h2 className="text-2xl font-semibold text-gray-800">
              Choose Your Resume
            </h2>

            <p className="text-gray-500 text-sm mt-1 mb-6">
              Select the resume you want to use for this application.
            </p>

            {/* Existing Resume */}
            {userData?.resume && (
              <div
                onClick={() => {
                  setSelectedResume("existing");
                  setNewResume(null);
                }}
                className={`border rounded-lg p-4 cursor-pointer mb-4 ${
                  selectedResume === "existing"
                    ? "border-blue-600 bg-blue-50"
                    : "border-gray-300"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="text-2xl">📄</div>

                  <div>
                    <h3 className="font-medium">Continue Existing Resume</h3>

                    <p className="text-sm text-gray-500">
                      Use your profile resume
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* New Resume */}
            <div
              onClick={() => setSelectedResume("new")}
              className={`border rounded-lg p-4 cursor-pointer ${
                selectedResume === "new"
                  ? "border-blue-600 bg-blue-50"
                  : "border-gray-300"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="text-2xl">📤</div>

                <div>
                  <h3 className="font-medium">Upload New Resume</h3>

                  <p className="text-sm text-gray-500">
                    Use a different resume for this job
                  </p>
                </div>
              </div>
            </div>

            {/* File Input */}
            {selectedResume === "new" && (
              <div className="mt-4">
                <input
                  type="file"
                  accept=".pdf"
                  onChange={(e) => {
                    setNewResume(e.target.files[0]);
                  }}
                  className="w-full border rounded-lg p-2"
                />

                {newResume && (
                  <p className="text-sm text-green-600 mt-2">
                    Selected: {newResume.name}
                  </p>
                )}
              </div>
            )}

            {/* Buttons */}
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => {
                  setShowResumeOptions(false);
                  setNewResume(null);
                }}
                disabled={applyLoading}
                className="px-5 py-2 border rounded-lg"
              >
                Cancel
              </button>

              <button
                onClick={analyzeResume}
                disabled={analysisLoading}
                className="px-5 py-2 bg-blue-600 text-white rounded-lg"
              >
                {analysisLoading ? "Analyzing..." : "Analyze Resume"}
              </button>
            </div>
          </div>
        </div>
      )}

      {showAnalysis && jobAnalysis && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  AI Job Match Analysis
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  How well your resume matches this job
                </p>
              </div>

              <button
                onClick={() => setShowAnalysis(false)}
                className="text-gray-500 text-2xl"
              >
                ×
              </button>
            </div>

            {/* Match Score */}
            <div className="flex flex-col items-center mb-8">
              <div className="w-32 h-32 rounded-full border-8 border-blue-500 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-4xl font-bold text-blue-600">
                    {jobAnalysis.matchScore}%
                  </p>

                  <p className="text-xs text-gray-500">Match</p>
                </div>
              </div>

              <p className="text-lg font-semibold text-gray-700 mt-3">
                {jobAnalysis.matchScore >= 80
                  ? "Excellent Match"
                  : jobAnalysis.matchScore >= 60
                    ? "Good Match"
                    : "Needs Improvement"}
              </p>
            </div>

            {/* Matched Skills */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                ✅ Matched Skills
              </h3>

              <div className="flex flex-wrap gap-2">
                {jobAnalysis.matchedSkills?.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Missing Skills */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                ⚠️ Missing Skills
              </h3>

              <div className="flex flex-wrap gap-2">
                {jobAnalysis.missingSkills?.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Strengths */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                💪 Strengths
              </h3>

              <ul className="space-y-2">
                {jobAnalysis.strengths?.map((strength, index) => (
                  <li key={index} className="text-gray-600 text-sm flex gap-2">
                    <span className="text-green-600">✓</span>
                    {strength}
                  </li>
                ))}
              </ul>
            </div>

            {/* Recommendations */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                💡 Recommendations
              </h3>

              <ul className="space-y-2">
                {jobAnalysis.recommendations?.map((recommendation, index) => (
                  <li key={index} className="text-gray-600 text-sm flex gap-2">
                    <span className="text-blue-600">→</span>
                    {recommendation}
                  </li>
                ))}
              </ul>
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-3 pt-4 border-t">
              <button
                onClick={() => setShowAnalysis(false)}
                className="px-5 py-2 border rounded-lg text-gray-700"
              >
                Back
              </button>

              <button
                onClick={submitApplication}
                disabled={applyLoading}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg"
              >
                {applyLoading ? "Applying..." : "Continue & Apply"}
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
};

export default ApplyJobs;
