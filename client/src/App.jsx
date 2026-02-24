import React, { useContext } from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home.jsx';
import ApplyJobs from './pages/ApplyJobs.jsx';
import Applications from './pages/Applications.jsx';
import RecuiterLogin from './components/RecuiterLogin.jsx';
import { AppContext } from './context/AppContext.jsx';
import Dashboard from './pages/Dashbord.jsx';
import AddJob from './pages/AddJob.jsx';
import ViewApplication from './pages/ViewApplication.jsx';
import ManageJob from './pages/ManageJob.jsx';
import 'quill/dist/quill.snow.css'
import { ToastContainer, toast } from 'react-toastify';
// import UserDebug from './components/UserDebug'; // Comment out this import


const App = () => {
  const { showRecrutierLogin, companyToken} = useContext(AppContext);

  return (
    <div>
      {/* <UserDebug /> */} {/* Comment out or remove this line */}
      {showRecrutierLogin && <RecuiterLogin />}
      <ToastContainer />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/apply-job/:id" element={<ApplyJobs />} />
        <Route path="/application" element={<Applications />} />

{companyToken ? <>
<Route path="/dashboard" element={<Dashboard />}>
          <Route path="add-job" element={<AddJob />} />
          <Route path="view-application" element={<ViewApplication />} />
          <Route path="manage-job" element={<ManageJob />} />
        </Route>
</> :
null
}
    
        
      </Routes>
    </div>
  );
};

export default App;
