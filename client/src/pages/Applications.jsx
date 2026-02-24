import React, { useContext, useState } from "react";
import Navbar from "../components/Navbar.jsx";
import { assets, jobsApplied } from "../assets/assets";
import moment from "moment";
import Footer from "../components/Footer.jsx";
import { AppContext } from "../context/AppContext.jsx";
import { useAuth, useUser } from "@clerk/clerk-react";
import { toast } from "react-toastify";
import axios from "axios";

const Applications = () => {
  const { user } = useUser();
  const { getToken } = useAuth();

  const [isEdit, setIsEdit] = useState(false);
  const [resume, setResume] = useState(null);

  const { backendUrl, userData, userDataApplications, fetchUserData } =
    useContext(AppContext);
  const updateResume = async () => {
    try {
      if (!resume) {
        toast.error("Please select a resume first");
        return;
      }

      const formData = new FormData();
      formData.append("resume", resume);
      const token = await getToken();
      if (!token) {
        toast.error("Not authenticated");
        return;
      }
      console.log(
        "[updateResume] token present?",
        !!token,
        "file?",
        !!resume,
        resume?.name
      );
      if (token) {
        console.log(
          "[updateResume] token (masked):",
          token.slice(0, 16) + "..."
        );
      } else {
        console.warn("[updateResume] No token returned from Clerk getToken()");
      }

      const { data, status } = await axios.post(
        `${backendUrl}/api/users/resume`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
          validateStatus: () => true, // let us see non-2xx responses
        }
      );

      console.log("[updateResume] status:", status, "data:", data);

      if (data?.success) {
        toast.success(data.message || "Resume updated successfully!");
        await fetchUserData();
      } else {
        toast.error(data?.message || `Resume update failed (${status})`);
      }
    } catch (error) {
      console.error(
        "Resume update error:",
        error?.response?.data || error.message
      );
      toast.error(
        error?.response?.data?.message ||
          error.message ||
          "Failed to update resume"
      );
    } finally {
      setIsEdit(false);
      setResume(null);
    }
  };

  return (
    <>
      <Navbar />
      <div className="container px-4 min-h-[65vh] 2xl:px-20 mx-auto my-10">
        <h2 className="text-xl font-semibold">Your Resume</h2>

        <div className="flex gap-2 mb-6 mt-3">
          {isEdit || (userData && userData.resume === "") ? (
            <>
              <label className="flex items-center" htmlFor="resumeUpload">
                <p className="bg-blue-100 text-blue-500 rounded px-4 py-2">
                  {resume ? resume.name : " Select Resume"}
                </p>
                <input
                  id="resumeUpload"
                  onChange={(e) => setResume(e.target.files[0])}
                  accept="application/pdf"
                  type="file"
                  hidden
                />
                <img className="ml-3" src={assets.profile_upload_icon} alt="" />
              </label>
              <button
                onClick={updateResume}
                className="bg-green-200 border border-green-500 px-3 py-1.5 rounded"
              >
                Save
              </button>
            </>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={() => setIsEdit(true)}
                className="bg-blue-100 text-blue-600 px-4 py-2 rounded-lg"
              >
                Select Resume
              </button>
              <button
                onClick={() => setIsEdit(true)}
                className="text-gray-500 border border-gray-300 rounded-lg px-4 py-2 ml-2"
              >
                Edit
              </button>
            </div>
          )}
        </div>

        <h2 className="text-xl font-semibold mb-4">Applied Jobs</h2>
        <table className="min-w-full bg-white border border-gray-300 rounded-lg">
          <thead>
            <tr>
              <th className="py-3 px-4 text-left">Company</th>
              <th className="py-3 px-4 text-left">Job Title</th>
              <th className="py-3 px-4 text-left max-sm:hidden">Location</th>
              <th className="py-3 px-4 text-left max-sm:hidden">Date</th>
              <th className="py-3 px-4 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {userDataApplications.map((job, idx) => (
              <tr key={idx}>
                <td className="py-2 px-4 flex items-center gap-2">
                  <img className="w-8 h-8" src={job.companyId.image} alt="" />
                  {job.companyId.name}
                </td>
                <td className="px-4 py-3">{job.jobId.title}</td>
                <td className="px-4 py-4">{job.jobId.location}</td>
                <td className="px-4 py-4">
                  {job.date
                    ? moment(job.date).isValid()
                      ? moment(job.date).format("DD MMM YYYY")
                      : "Invalid date"
                    : "—"}
                </td>
                <td className="px-4 py-4">
                  <span
                    className={
                      job.status === "Accepted"
                        ? "bg-green-200 px-2 py-1 rounded"
                        : job.status === "Rejected"
                        ? "bg-red-200 px-2 py-1 rounded"
                        : "bg-blue-200 px-2 py-1 rounded"
                    }
                  >
                    {job.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Footer />
    </>
  );
};

export default Applications;
