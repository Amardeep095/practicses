import { useState,useMemo } from 'react'
import './App.css'

function App() {
  const [number, setNumber] = useState(0)
  const[counter,setCounter] = useState(0)

  function cubeNum(num){
    console.log('Calcuation done!');
    return Math.pow(num,3)
  }


  const result = useMemo(()=>{return cubeNum(number)},[number]);

  return (
    <>
      <input type="number" value={number} onChange={(e)=>{setNumber(e.target.value)}}/>
<h1>Cube of the number :{result}</h1>
<button onClick={()=>{setCounter(counter+1)}}>Counter++</button>
<h1>Counter:{counter}</h1>

    </>
  )
}

export default App
