import React from 'react'
import Navbar from '../components/Navbar.jsx'
import Hero from '../components/Hero.jsx'
import JobListing from '../components/JobListing.jsx'
import AppDownload from '../components/AppDownload.jsx'
import Footer from '../components/Footer.jsx'
import Chatbot from '../components/Chatbot.jsx'

const Home = () => {
  return (
    <div>
      <Navbar />
      <Hero />
      <JobListing />
      <AppDownload />
      <Footer />
      <Chatbot />
    </div>
  )
}

export default Home
