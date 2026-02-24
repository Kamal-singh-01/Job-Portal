import React, { useContext, useEffect, useState } from "react";
import { assets } from "../assets/assets";
import { AppContext } from "../context/AppContext.jsx";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const RecruiterLogin = () => {
  const [state, setState] = useState("Login"); // "Login" | "Signup"
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [image, setImage] = useState(false);
  const [isTextDataSubmitted, setIsTextDataSubmitted] = useState(false);
  const [loading, setLoading] = useState(false); // <-- NEW loading state
  const { setShowRecrutierLogin, backendUrl, setCompanyData, setCompanyToken } =
    useContext(AppContext);
  const navigate = useNavigate();

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    if (state === "Signup" && !isTextDataSubmitted) {
      return setIsTextDataSubmitted(true);
    }

    setLoading(true); // show loading spinner

    try {
      if (state === "Login") {
        const { data } = await axios.post(`${backendUrl}/api/company/login`, {
          email,
          password,
        });

        if (data.success) {
          setCompanyToken(data.token);
          setCompanyData(data.company);
          localStorage.setItem("companyToken", data.token);
          localStorage.setItem("companyData", JSON.stringify(data.company));
          setShowRecrutierLogin(false);
          navigate("/dashboard");
        } else {
          toast.error(data.message);
        }
      } else {
        // Create Account
        const formData = new FormData();
        formData.append("name", name);
        formData.append("email", email);
        formData.append("password", password);
        formData.append("image", image);

        const { data } = await axios.post(
          `${backendUrl}/api/company/register`,
          formData
        );

        if (data.success) {
          setCompanyToken(data.token);
          setCompanyData(data.company);
          localStorage.setItem("companyToken", data.token);
          localStorage.setItem("companyData", JSON.stringify(data.company));
          setShowRecrutierLogin(false);
          navigate("/dashboard");
        } else {
          toast.error(data.message);
        }
      }
    } catch (error) {
      toast.error("Something went wrong. Try again!");
    } finally {
      setLoading(false); 
    }
  };

  useEffect(() => {
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  return (
    <div className="fixed inset-0 z-10 backdrop-blur-sm bg-black/30 flex justify-center items-center overflow-y-auto">
      <form
        onSubmit={onSubmitHandler}
        className="relative bg-white p-10 rounded-xl text-slate-700 w-96 my-10"
      >
        <h2 className="text-2xl text-center font-medium text-neutral-700">
          Recruiter {state}
        </h2>
        <p className="text-sm text-center">
          Welcome back! Please {state === "Login" ? "sign in" : "sign up"} to
          continue
        </p>

        {/* Show loading overlay */}
        {loading && (
          <div className="absolute inset-0 bg-white/70 flex items-center justify-center rounded-xl">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        )}

        {/* Signup step 2 (image upload etc.) */}
        {!loading &&
          (state === "Signup" && isTextDataSubmitted ? (
            <div className="flex items-center gap-4 mt-5">
              <label htmlFor="image">
                <img
                  className="w-16 rounded-full"
                  src={image ? URL.createObjectURL(image) : assets.upload_area}
                  alt=""
                />
                <input
                  onChange={(e) => setImage(e.target.files[0])}
                  type="file"
                  id="image"
                  hidden
                />
              </label>
              <p>
                Upload Company <br /> logo
              </p>
            </div>
          ) : (
            <>
              {state === "Signup" && (
                <div className="border border-gray-200 px-4 py-2 gap-2 flex items-center rounded-xl mt-6 ">
                  <img src={assets.person_icon} alt="" />
                  <input
                    className="outline-none text-sm w-full"
                    onChange={(e) => setName(e.target.value)}
                    value={name}
                    type="text"
                    placeholder="Company name"
                    required
                  />
                </div>
              )}

              <div className="border border-gray-200 px-4 mt-6 py-2 gap-2 flex items-center rounded-xl">
                <img src={assets.email_icon} alt="" />
                <input
                  className="outline-none text-sm w-full"
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                  type="email"
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div className="border border-gray-200 mt-6 px-4 py-2 gap-2 flex items-center rounded-xl">
                <img src={assets.lock_icon} alt="" />
                <input
                  className="outline-none text-sm w-full"
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                  type="password"
                  placeholder="Enter your password"
                  required
                />
              </div>
            </>
          ))}

        {state === "Login" && !loading && (
          <p className="text-blue-400 text-sm mt-4 cursor-pointer">
            Forgot Password?
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className={`w-full rounded-full py-2 px-4 mt-5 cursor-pointer ${
            loading ? "bg-gray-400" : "bg-blue-500 text-white"
          }`}
        >
          {loading
            ? "Processing..."
            : state === "Login"
            ? "Login"
            : isTextDataSubmitted
            ? "Create account"
            : "Next"}
        </button>

        {state === "Login" ? (
          <p className="mt-5 text-center">
            Don&apos;t have an account?{" "}
            <span
              className="cursor-pointer text-blue-500"
              onClick={() => {
                setState("Signup");
                setIsTextDataSubmitted(false);
              }}
            >
              Signup
            </span>
          </p>
        ) : (
          <p className="mt-5 text-center">
            Already have an account?{" "}
            <span
              className="cursor-pointer text-blue-500"
              onClick={() => setState("Login")}
            >
              Login
            </span>
          </p>
        )}
        <img
          onClick={() => setShowRecrutierLogin(false)}
          className="absolute top-5 right-5 cursor-pointer"
          src={assets.cross_icon}
          alt=""
        />
      </form>
    </div>
  );
};

export default RecruiterLogin;
