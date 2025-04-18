import React from 'react'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'

const BaseUser = ({ children }) => {
  return (
    <div className="min-h-screen w-full flex flex-col relative overflow-hidden">
      <div className="min-h-screen w-full text-gray-800">
        <Navbar />
        <div className="container mx-auto px-6 py-16 text-center my-10">
          {children}
        </div>
        <Footer />
      </div>
    </div>
  )
}

export default BaseUser