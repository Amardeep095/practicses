import { use, useState } from 'react'
import './App.css'

function App() {

  const [counter, setCounter] = useState(0);

   const addValue = () => {
    setCounter(counter + 1);
  }

  const removeValue = () => {
    if(counter > 0) {
      setCounter(counter - 1);
    }
  }

  return (
   <>
   <h1>Prince raj</h1>
   <h2>counter value: {counter}</h2>

   <button 
   onClick={addValue}>Add value {counter}</button>
   <br />
   <button onClick={removeValue}>remove value {counter}</button>
   <br />
   <p>{counter}</p>
   </>
  )
}

export default App
