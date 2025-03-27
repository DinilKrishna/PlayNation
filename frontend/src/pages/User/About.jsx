import React from 'react'
import BaseUser from '../Base/BaseUser'

const About = () => {
  return (
    <BaseUser>
        <h1 className="text-4xl font-bold text-green-600 mb-6">About Us</h1>
        <p className="text-lg max-w-2xl mx-auto">
          PlayNation is your go-to platform for booking sports turfs and playgrounds with ease. 
          We aim to provide a seamless booking experience so you can focus on what matters—playing!  
          Whether it's football, cricket, or badminton, we've got you covered.
        </p>
    </BaseUser>
  )
}

export default About