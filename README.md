##. Job Portal Website

A full-stack MEARN (MongoDB, Express, React, Node.js) job portal where recruiters can post jobs and applicants can apply by uploading their resumes.
The app features authentication with Clerk, styling with Tailwind CSS, and file storage on Cloudinary.

🚀 Features

🔐 Authentication & Authorization – Powered by Clerk

🎨 Responsive UI – Built with Tailwind CSS

🗄️ Database – MongoDB Atlas
 for scalable cloud data storage

☁️ Resume Uploads – Stored securely on Cloudinary

👨‍💼 Recruiter Role – Create, manage, and view job listings

👩‍💻 Job Seeker Role – Apply to jobs and upload resumes

🔎 Job Search – Search and filter job postings easily

🛠️ Tech Stack

Frontend:

React.js

Tailwind CSS

Clerk (for authentication)

Backend:

Node.js

Express.js

Database & Storage:

MongoDB Atlas

Cloudinary

⚙️ Installation & Setup

Clone the repository

git clone https://github.com/your-username/job-portal.git
cd job-portal


Install dependencies (for both client & server)

cd client
npm install
cd ../server
npm install


Environment Variables
Create a .env file in the server folder with:

MONGO_URI=your_mongodb_atlas_connection
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key


And in client (Vite or CRA depending on your setup):

VITE_BACKEND_URL=http://localhost:5000
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key


-- Run the backend

cd server
npm run dev


-- Run the frontend

cd client
npm run dev


📦 Deployment

Frontend: Vercel / Netlify

Backend:  Netlify

Database: MongoDB Atlas

Media Storage: Cloudinary

🤝 Contributing

Contributions, issues, and feature requests are welcome!
Feel free to fork the repo and submit a PR.
