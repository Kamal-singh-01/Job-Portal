## 🚀 Job Portal Website

A full-stack **MERN (MongoDB, Express.js, React.js, Node.js)** job portal where recruiters can post and manage jobs, while job seekers can search and apply for jobs by uploading their resumes.

The application features authentication with Clerk, responsive styling with Tailwind CSS, resume storage with Cloudinary, and an AI-powered chatbot using Google Gemini to assist users with job searches, career questions, and interview preparation.

---

## 🚀 Features

### 🔐 Authentication & Authorization
- User authentication and authorization powered by Clerk
- Separate recruiter and job seeker functionality

### 🎨 Responsive UI
- Modern and responsive interface
- Built with Tailwind CSS
- Optimized for desktop and mobile devices

### 🗄️ Database
- MongoDB Atlas for scalable cloud data storage
- Stores users, companies, jobs, and job applications

### ☁️ Resume Uploads
- Resume uploads handled securely using Cloudinary
- Recruiters can access applicant resumes

### 👨‍💼 Recruiter Features
- Create and publish job listings
- Manage existing job postings
- View job applications
- Review applicant information and resumes

### 👩‍💻 Job Seeker Features
- Browse available jobs
- Search and filter job postings
- View detailed job information
- Apply for jobs
- Upload resumes while applying

### 🔎 Job Search
- Search jobs by title
- Filter jobs based on location, category, and other job attributes
- Displays real-time job listings from MongoDB

### 🤖 AI-Powered Job Assistant
- Integrated AI chatbot powered by **Google Gemini**
- Helps users search for relevant job opportunities using natural language
- Understands queries such as:
  - "Show me React jobs"
  - "Find programming jobs in Delhi"
  - "Show me senior developer jobs"
- Uses conversation history to maintain context during conversations
- Connects with MongoDB to retrieve real job listings
- Uses actual job data from the database instead of generating fake job information
- Provides career guidance and interview preparation assistance
- Returns relevant job information including:
  - Job title
  - Company
  - Location
  - Job level
  - Salary
- Users can view specific jobs directly from chatbot results
- Job results are linked to their corresponding MongoDB job IDs

---

## 🛠️ Tech Stack

### Frontend
- React.js
- Tailwind CSS
- Clerk
- React Router
- Vite

### Backend
- Node.js
- Express.js
- Google Gemini API

### Database & Storage
- MongoDB Atlas
- Cloudinary

### AI
- Google Gemini
- Gemini-powered conversational job assistant
- Natural language job search
- Conversation history

---

## ⚙️ Installation & Setup

### 1. Clone the repository

```bash
git clone https://github.com/your-username/job-portal.git
cd job-portal