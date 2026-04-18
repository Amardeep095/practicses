// import { useState ,useRef } from 'react'
// import './App.css'
// import { useEffect } from 'react'

// function App() {
//   const [value , setValue]=useState(0)
//   const count=useRef(0);

//   useEffect(()=>{
//     count.current=count.current+1;
//   })
//   return (
//     <>
//       <button onClick={()=>{setValue(prev=>prev-1)}}>-1</button>
//       <h1>{value}</h1>
//        <button onClick={()=>{setValue(prev =>prev+1)}}>+1</button>


//        <h1>Rende Count:{count.current}</h1>
//     </>
//   )
// }

// export default App





//-----------accessing the dom element --------------------------

import React from 'react'
import { useRef } from 'react'

function App() {

  const inputElem=useRef();

  const btnClicked =()=>{
    console.log(inputElem.current);
       inputElem.current.style.background="blue";
  }
  
  return (
    <>
    <input type="text" ref={inputElem} />
      <button onClick={btnClicked}>Click Here</button>    
    </>
  )
}
export default App
