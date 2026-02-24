import React, { useEffect, useRef, useState, useContext } from 'react';
import Quill from 'quill';
import { JobCategories, JobLocations } from '../assets/assets';
import axios from 'axios';
import { AppContext } from '../context/AppContext.jsx';
import { toast } from 'react-toastify';

const AddJob = () => {
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('Bangalor');
  const [category, setCategory] = useState('Programming');
  const [level, setLevel] = useState('Beginner level');
  const [salary, setSalary] = useState(0);
  const [loading, setLoading] = useState(false); // ✅ Loading state

  const { backendUrl, companyToken } = useContext(AppContext);

  const editorRef = useRef(null);
  const quillRef = useRef(null);

  useEffect(() => {
    if (!quillRef.current && editorRef.current) {
      quillRef.current = new Quill(editorRef.current, {
        theme: 'snow',
      });
    }
  }, []);

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    if (!companyToken) {
      toast.error("You must be logged in to add a job");
      return;
    }

    try {
      setLoading(true); // start loading
      const description = quillRef.current.root.innerHTML;

      const { data } = await axios.post(
        `${backendUrl}/api/company/post-job`,
        { title, description, location, salary, level, category },
        { headers: { Authorization: `Bearer ${companyToken}` } }
      );

      if (data?.success) {
        toast.success(data.message || "Job added successfully");

        // Reset form fields
        setTitle('');
        setSalary(0);
        setLocation(JobLocations[0]);
        setCategory(JobCategories[0]);
        setLevel('Beginner level');
        quillRef.current.root.innerHTML = '';
      } else {
        toast.error(data?.message || "Failed to add job");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message || "Something went wrong");
    } finally {
      setLoading(false); // stop loading
    }
  };

  return (
    <div>
      <form onSubmit={onSubmitHandler} className='container p-4 w-full flex flex-col items-start gap-3'>
        <div className='w-full'>
          <p className='mb-2'>Job Title</p>
          <input
            className='w-full max-w-lg px-3 py-1.5 border-2 border-gray-200'
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            type="text"
            required
            placeholder='Type here'
          />
        </div>

        <div className='w-full max-w-lg'>
          <p className='my-2'>Description</p>
          <div ref={editorRef}></div>
        </div>

        <div className='flex flex-col sm:flex-row gap-2 w-full sm:gap-8'>
          <div className='mb-2'>
            <select
              className='w-full px-4 py-2 border bg-gray-100 border-gray-200 rounded'
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {JobCategories.map((cat, idx) => (
                <option key={idx} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className='mb-2'>
            <select
              className='w-full px-4 py-2 border bg-gray-100 border-gray-200 rounded'
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            >
              {JobLocations.map((loc, idx) => (
                <option key={idx} value={loc}>{loc}</option>
              ))}
            </select>
          </div>

          <div className='mb-2'>
            <select
              className='w-full px-4 py-2 border bg-gray-100 border-gray-200 rounded'
              value={level}
              onChange={(e) => setLevel(e.target.value)}
            >
              <option value="Beginner level">Beginner level</option>
              <option value="Intermediate level">Intermediate level</option>
              <option value="Senior level">Senior level</option>
            </select>
          </div>
        </div>

        <div>
          <p className='mb-2'>Salary</p>
          <input
            className='w-35 px-4 py-2 border border-gray-300 rounded'
            type="number"
            min={0}
            placeholder='25000'
            value={salary}
            onChange={(e) => setSalary(e.target.value)}
          />
        </div>

        <button
          type="submit"
          className='border mt-2 border-white bg-black text-white rounded px-3 py-3 w-28 flex justify-center items-center'
          disabled={loading} // ✅ disable button while loading
        >
          {loading ? (
            <div className="animate-spin h-5 w-5 border-b-2 border-white rounded-full"></div>
          ) : (
            'Add'
          )}
        </button>
      </form>
    </div>
  );
};

export default AddJob;
