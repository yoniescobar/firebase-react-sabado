import { useState, useEffect } from 'react'

import app from '../firebase-config'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { getFirestore, collection, addDoc, getDocs, doc, deleteDoc, getDoc, setDoc } from 'firebase/firestore'

//getFirestores, getFirestore,collection, addDoc,getDocs,doc,deleteDoc .. gestion de la base de datos NoSql
const auth = getAuth(app)

const db = getFirestore(app) // inicializa la base datos

export default function Home({ correoUsuario }) {

    const persona = { // objeto persona para guardar los datos
        nombre: '',
        correo: '',
        telefono: '',
        edad: '',
    }

    const [user, setUser] = useState(persona) //Guardar los datos del objeto persona
    const [lista, setLista] = useState([]) // guarda los datos del objeto persona en una lista
    const [title, setTitle] = useState()

    // --------------------------- Capturar los datos del formulario y los gurada en el objeto perona -----------

    const capturarDatos = (e) => {
        const { name, value } = e.target
        setUser({ ...user, [name]: value })
        console.log('---- data ----', setUser)
    }

    // ------------------------- Persistencia en la base de datos  ------------------------

    const guardarDatos = async (e) => {
        e.preventDefault()

        try {

            const docRef = await addDoc(collection(db, "agenda"), user);// Guarda los datos en la bd
            console.log("Documento data ---- ", docRef.id); //el id del documento
            setUser(persona) // setea el objeto con valores vacios ''
            alert('Se ha guardado correctamente....!')
            obtenerDatos() // actualizar la lista
            setTitle(false)
        } catch (e) {
            console.log("Error en agregar documento: ", e)

        }
    }


    const obtenerDatos = async () => {
        try {
            const datos = await getDocs(collection(db, "agenda")) //conexion a bd
            const arrayDatos = datos.docs.map(doc => ({ id: doc.id, ...doc.data() })) // guardar los datos en un array
            setLista(arrayDatos) // seteo los datos de lista
        } catch (e) {
            console.log(e)
        }
    }

    const updateUser = async (id) => {

        try {
            const docRef = doc(db, "agenda", id)    // obtengo el id del documento
            const docSnap = await getDoc(docRef) // obtine los datos del docum

            if (docSnap.exists()) { // si existe el documento
                setUser({ ...docSnap.data() }) //enviamos los datos del documento al formulario
                setTitle(true)
            } else {
                console.log('El documento no existe')
            }

        } catch (error) {
            console.log(error)
        }
    }

    const deleteUser = async (id) => {

        const confirmarDelete = window.confirm('¿Estás seguro de eliminar este registro? ')

        if (confirmarDelete) {
            try {
                await deleteDoc(doc(db, "agenda", id)) // elimnina el docuemnto de la base datos 
                obtenerDatos()
            } catch (e) {
                console.log(e)
            }

            alert('se ha eliminado correctamente el registro...')
        }
    }

    useEffect(() => {
        obtenerDatos()
    }, [])

    return (
        <div className='container'>
            <h3 className=''>¡Hola <strong style={{ color: 'Blue' }}>{correoUsuario}!</strong> Haz Iniciado Sesión</h3>
            <button className='btn btn-danger' onClick={() => auth.signOut(auth)}>Cerrar Sesión</button>
            <hr />

            <form onSubmit={guardarDatos}>
                <div className="card card-body">
                    <input
                        type="text"
                        placeholder="Ingrese su nombre"
                        className="form-control mb-2"
                        name='nombre'
                        required
                        value={user.nombre}
                        onChange={capturarDatos}
                    />
                    <input
                        type="email"
                        placeholder="Ingrese su correo"
                        className="form-control mb-2"
                        name='correo'
                        required
                        value={user.correo}
                        onChange={capturarDatos}

                    />
                    <input
                        type="phone"
                        placeholder="Ingrese su Teléfono"
                        className="form-control mb-2"
                        name='telefono'
                        required
                        value={user.telefono}
                        onChange={capturarDatos}
                    />
                    <input
                        type="number"
                        placeholder="Ingrese su edad"
                        className="form-control mb-2"
                        name='edad'
                        required
                        value={user.edad}
                        onChange={capturarDatos}
                    />

                    <button
                        className={!title ? 'btn btn-primary mt-4 form-control' : 'btn btn-success mt-4 form-control'}
                        type='submit'>{!title ? 'Guardar Registro' : 'Guardar Cambios'}</button>
                </div>
            </form>

            <hr />

            <table className="table table-striped">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Nombre</th>
                        <th>Correo</th>
                        <th>Telefono</th>
                        <th>Edad</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        lista.map((item, index) => (
                            <tr key={item.id}>
                                <td>{index + 1}</td>
                                <td>{item.nombre}</td>
                                <td>{item.correo}</td>
                                <td>{item.telefono}</td>
                                <td>{item.edad}</td>
                                <td>
                                    <button className="btn btn-danger btn-sm mx-2" onClick={() => deleteUser(item.id)} >Eliminar</button>
                                    <button className="btn btn-warning btn-sm mx-2" onClick={() => updateUser(item.id)}>Editar</button>
                                </td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>



        </div>
    )
}
