// useEffect: persistent state
// http://localhost:3000/isolated/exercise/02.js

import * as React from 'react'

const useLocalStorage = (
  key,
  defaultValue,
  {serialize = JSON.stringify, deserialize = JSON.parse},
) => {
  const [state, setState] = React.useState(() => {
    const valueInStorage = window.localStorage.getItem(key)
    if (valueInStorage) {
      try {
        return deserialize(valueInStorage)
      } catch (error) {
        window.localStorage.removeItem(key)
      }
    }
    return typeof defaultValue === 'function' ? defaultValue() : defaultValue
  })

  const prevKeyRef = React.useRef()

  React.useEffect(() => {
    const prevKey = prevKeyRef.current
    if (prevKey !== key) {
      window.localStorage.removeItem(prevKey)
    }
    prevKey.current = key
    window.localStorage.setItem(key, serialize(state))
  }, [state, key, serialize])
  return [state, setState]
}

function Greeting({initialName = ''}) {
  const [name, setName] = useLocalStorage('name', initialName)

  function handleChange(event) {
    setName(event.target.value)
  }
  return (
    <div>
      <form>
        <label htmlFor="name">Name: </label>
        <input value={name} onChange={handleChange} id="name" />
      </form>
      {name ? <strong>Hello {name}</strong> : 'Please type your name'}
    </div>
  )
}

function App() {
  return <Greeting />
}

export default App
