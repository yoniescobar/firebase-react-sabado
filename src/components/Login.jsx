import { useState, useEffect } from 'react'
import img1 from '../assets/1.png'
import img2 from '../assets/2.png'
import img3 from '../assets/3.png'


import app from '../firebase-config'
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth"; // importar funciones de autenticacion de firebase

const auth = getAuth(app) // inicializamos la autencion.


export default function Login() {

    const [registro, setRegistro] = useState(false) // estado para cambiar el texto del boton 

    const handlerSumit = async (e) => { // funcion para crear un usuario o Iniciar Sesion
        e.preventDefault()
        const email = e.target.email.value
        const password = e.target.password.value

        console.log(password)

        if (registro) {
            //await createUserWithEmailAndPassword(auth,email,password) // crear un usuario

            try {
                const user = await createUserWithEmailAndPassword(auth, email, password) // crear un usuario
                console.log(user)
            } catch (error) {
                console.log(error)
            }
        } else {

            try {

                const user = await signInWithEmailAndPassword(auth, email, password) // Iniciar sesion
                console.log(user)
            } catch (error) {
                alert('Usuario o Contraseña incorrecto')
                console.log('--------------', error)
            }
        }
    }

    return (
        <div className='row'>
            {/* carrusel de imagenes  */}
            <div className='col-md-8  col-12'>
                <div id="carouselExampleControls" className="carousel slide" data-bs-ride="carousel">
                    <div className="carousel-inner">
                        <div className="carousel-item active">
                            <img src={img1} className="size-imagen" alt="..." />
                        </div>
                        <div className="carousel-item">
                            <img src={img2} className="size-imagen" alt="..." />
                        </div>
                        <div className="carousel-item">
                            <img src={img3} className="size-imagen" alt="..." />
                        </div>
                    </div>
                    <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleControls" data-bs-slide="prev">
                        <span className="carousel-control-prev-icon" aria-hidden="true" />
                        <span className="visually-hidden">Previous</span>
                    </button>
                    <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleControls" data-bs-slide="next">
                        <span className="carousel-control-next-icon" aria-hidden="true" />
                        <span className="visually-hidden">Next</span>
                    </button>
                </div>
            </div>

            {/* formulario de login */}
            <div className='col-md-4  col-12'>
                <div className='container mt-5'>
                    <h1 className='text-center' >{registro ? 'Registrate' : 'Iniciar Sesion'}</h1>
                    <form className='mt-4' onSubmit={handlerSumit}>
                        <div className="mb-3">
                            <label className='form-label'>Dirección</label>
                            <input
                                type="email"
                                className="form-control"
                                placeholder='Ingrese su correo'
                                name='email'
                                id='email'
                                required
                            />
                        </div>

                        <div className="mb-3">
                            <label className='form-label'>Password</label>
                            <input
                                type="password"
                                className="form-control"
                                placeholder='Ingrese su password'
                                name='password'
                                id='password'
                                required
                            />
                        </div>

                        <button
                            type='submit'
                            className={registro ? 'btn btn-success mt-4 form-control' : 'btn btn-primary mt-4 form-control'}
                        >{registro ? 'Registrarse..' : 'Iniciar Sesión'}
                        </button>
                    </form>

                    <div className='form-group '>
                        <button className='btn btn-secondary mt-4 form-control' onClick={() => setRegistro(!registro)}>
                            {registro ? '¿Ya tienes cuenta?' : '¿No tienes cuenta?, Registrate...!'}
                        </button>
                    </div>


                </div>

            </div>
        </div>
    )
}
