import { useState } from 'react'
import Login from './components/Login'



import app from './firebase-config'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import Home from './components/Home'
const auth = getAuth(app)

export default function App() {

  const [usuario, setUsuario] = useState(null)

  onAuthStateChanged(auth, (userFirebase) => { // si el usuario esta logeado
    if (userFirebase) { // si el usuario esta logueado
      setUsuario(userFirebase) //guardae el usuario en el estado
    } else {
      setUsuario(null)
    }

  });

  return (
    <>
      {
        usuario ?
          <Home correoUsuario={usuario.email} />
          :
          <Login />
      }
    </>
  )
}
