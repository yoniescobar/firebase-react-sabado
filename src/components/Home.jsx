import { useState, useEffect } from 'react'

import app from '../firebase-config'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { getFirestore, collection, addDoc, getDocs, doc, deleteDoc, getDoc, setDoc } from 'firebase/firestore'
import Swal from 'sweetalert2'

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
    }

    // ------------------------- Persistencia en la base de datos  ------------------------

    const guardarDatos = async (e) => {
        e.preventDefault();
        try {
            if (!user.id) {
                Swal.fire({
                    title: '¿Está seguro de agregar el cliente?',
                    text: user.nombre,
                    icon: 'question',
                    showCancelButton: true,
                    confirmButtonText: 'Si',
                    cancelButtonText: 'No',
                }).then(async (result) => {
                    if (result.isConfirmed) {
                        try {
                            await addDoc(collection(db, "agenda"), user);
                            document.getElementById('nombre').focus();
                            setUser(persona);
                            await obtenerDatos();
                        } catch (error) {
                            console.log(error);
                        }
                    }
                });
            } else {
                Swal.fire({
                    title: '¿Está seguro de actualizar el cliente?',
                    text: user.nombre,
                    icon: 'question',
                    showCancelButton: true,
                    confirmButtonText: 'Si',
                    cancelButtonText: 'No',
                }).then(async (result) => {
                    if (result.isConfirmed) {
                        try {
                            await setDoc(doc(db, "agenda", user.id), { ...user });
                            document.getElementById('nombre').focus();
                            setTitle(false);
                            setUser(persona);
                            await obtenerDatos();
                        } catch (error) {
                            console.log(error);
                        }
                    }
                });
            }
        } catch (e) {
            console.log("Error adding/updating document: ", e);
        }
    };


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
                setUser({ ...docSnap.data(), id: docSnap.id }) //enviamos los datos del documento al formulario
                setTitle(true)
            } else {
                console.log('El documento no existe')
            }

        } catch (error) {
            console.log(error)
        }
    }

    const deleteUser = async (id, user) => {

        Swal.fire({
            title: `¿Está seguro de eliminar el cliente? ${user.nombre}`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Si',
            cancelButtonText: 'No',
        }).then(async (result) => { // async: es para que espere a que se ejecute await y luego continue el codigo
            if (result.isConfirmed) {
                try {
                    await deleteDoc(doc(db, "agenda", id)) // elimnina el docuemnto de la base datos 
                    await obtenerDatos()

                } catch (error) {
                    console.log(error)
                }
            }
        })
    }

    useEffect(() => {
        //fucus en el campo name con el id**
        document.getElementById('nombre').focus()
        obtenerDatos()
    }, [user])

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
                        id='nombre'
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
                                    <button className="btn btn-danger btn-sm mx-2" onClick={() => deleteUser(item.id, item)} >Eliminar</button>
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
