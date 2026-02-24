import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth, useUser } from "@clerk/clerk-react";

export const AppContext = createContext();

export const AppContextProvider = (props) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const { user } = useUser();
  const { getToken } = useAuth();


  // Search & Jobs
  const [searchFilter, setSearchFilter] = useState({ title: "", location: "" });
  const [isSearched, setIsSearched] = useState(false);
  const [job, setJob] = useState([]);

  // UI
  const [showRecrutierLogin, setShowRecrutierLogin] = useState(false);
  const [userData, setUserData] = useState(null);
  const [userDataApplications, setUserDataApplications] = useState([]);

  // Company Auth
  const [companyToken, setCompanyToken] = useState(() => {
    return localStorage.getItem("companyToken") || null;
  });

  const [companyData, setCompanyData] = useState(() => {
    const storedData = localStorage.getItem("companyData");
    return storedData ? JSON.parse(storedData) : null;
  });

  // Fetch jobs
  const fetchJobs = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/jobs`);
      if (data.success) {
        setJob(data.jobs || data.job);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Fetch company data
  const fetchCompanyData = async (token) => {
    if (!token) return;
    try {
      const { data } = await axios.get(`${backendUrl}/api/company/company`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.success) {
        setCompanyData(data.company);
        localStorage.setItem("companyData", JSON.stringify(data.company));
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      if (error.response?.status === 401) {
        setCompanyToken(null);
        setCompanyData(null);
        localStorage.removeItem("companyToken");
        localStorage.removeItem("companyData");
      }
      toast.error(error?.response?.data?.message || "Failed to fetch company data");
    }
  };

  // Fetch user data
  const fetchUserData = async () => {
    try {
      const token = await getToken();
      if (!token) return;

      const { data } = await axios.get(`${backendUrl}/api/users/sync`, {
        headers: { Authorization: `Bearer ${token}` },
        timeout: 15000,
      });
      console.log(data)

      if (data.success && data.user) {
        setUserData(data.user);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  //fetch userApplication user applied

  const fetchUserApplication = async() => {

    try {
        const token = await getToken();

    const {data} = await axios.get(`${backendUrl}/api/users/applications`,
      {headers: {Authorization : `Bearer ${token}`}}
    )
    if(data.success){
      console.log("data", data);
      setUserDataApplications(data.applications);
    }else{
      toast.error(data.message);
    }
      
    } catch (error) {
      toast.error(error.message);
    }
  
  }

  // On first load
  useEffect(() => {
    fetchJobs();
    if (companyToken && !companyData) {
      fetchCompanyData(companyToken);
    }
  }, []);

  // Whenever token changes
  useEffect(() => {
    if (companyToken && !companyData) {
      fetchCompanyData(companyToken);
    }
  }, [companyToken]);

  // Persist companyToken
  useEffect(() => {
    if (companyToken) {
      localStorage.setItem("companyToken", companyToken);
    } else {
      localStorage.removeItem("companyToken");
    }
  }, [companyToken]);

  // Fetch userData when Clerk user changes
  useEffect(() => {
    if (user) {
      fetchUserData();
      fetchUserApplication();
      
    } else {
      setUserData(null);
    }
  }, [user]);

  const value = {
    searchFilter,
    setSearchFilter,
    isSearched,
    setIsSearched,
    job,
    setJob,
    backendUrl,
    showRecrutierLogin,
    setShowRecrutierLogin,
    companyToken,
    setCompanyToken,
    companyData,
    setCompanyData,
    userData,
    setUserData,
    userDataApplications,
    setUserDataApplications,
    fetchUserData, fetchUserApplication
    
  };

  return (
    <AppContext.Provider value={value}>
      {props.children}
    </AppContext.Provider>
  );
};
