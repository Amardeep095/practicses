import { useState ,useCallback} from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'

function App() {
  const [length, setLength] = useState(8)
  const [numberAllowed, setNumberAllowed] = useState(false)
  const[characterAllowed, setCharacterAllowed] = useState(false)
  const[password, setPassword] = useState('')


  const passwordGenerator = useCallback(() => {
    // Password generation logic here
    let pass = ''
    let str = 'QWERTYUIOPASDFGHJKLZXCVBNMqwertyuiopasdfghjklzxcvbnm'
    if(numberAllowed) str += '0123456789'
    if(characterAllowed) str += '!@#$%^&*()_+'
    for(let i = 0; i < length; i++){
      pass += str.charAt(Math.floor(Math.random() * str.length))
    }
    setPassword(pass)

  }, [length, numberAllowed, characterAllowed, setPassword])

  return (
    <>
        <h1 className='text-4xl text-center text-white'>Password Generator</h1>
        <div>
          <div className='flex flex-col gap-4 mt-10'>
            <label className='text-white'>Password Length: {length}</label>
            <input type="range" min="4" max="20" value={length} onChange={(e) => setLength(e.target.value)} />
            <div className='flex gap-4'>
              <label className='text-white'><input type="checkbox" checked={numberAllowed} onChange={(e) => setNumberAllowed(e.target.checked)} /> Include Numbers</label>
              <label className='text-white'><input type="checkbox" checked={characterAllowed} onChange={(e) => setCharacterAllowed(e.target.checked)} /> Include Special Characters</label>
            </div>
            <button className='bg-blue-500 text-white px-4 py-2 rounded' onClick={passwordGenerator}>Generate Password</button>
            {password && <p className='text-green-500 mt-4'>Generated Password: {password}</p>}
          </div>
        </div>
    </>
  )
}

export default App
