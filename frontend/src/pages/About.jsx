import React from 'react'
import Navbar from '../components/Navbar'

const About = () => {
  return (
    <div className='min-h-screen w-full flex flex-col relative overflow-hidden'>
    <div className="min-h-screen w-full text-gray-800">
      <Navbar />
      <div className="container mx-auto px-6 py-16 text-center my-10">
        <h1 className="text-4xl font-bold text-green-400 mb-6">About Us</h1>
        <p className="text-lg max-w-2xl mx-auto">
          PlayNation is your go-to platform for booking sports turfs and playgrounds with ease. 
          We aim to provide a seamless booking experience so you can focus on what matters—playing!  
          Whether it's football, cricket, or badminton, we've got you covered.
        </p>
      </div>
    </div>
    </div>
  )
}

export default About