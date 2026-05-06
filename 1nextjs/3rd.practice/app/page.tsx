import React from 'react'
import Hello from '../components/hello'

function Home() {

  console.log("what type of componnet am I")
  return (
    <main>
    <div className='text-5xl underline'>Welcome amardeep </div>
    < Hello/>
    
    </main>
  )
}

export default Home