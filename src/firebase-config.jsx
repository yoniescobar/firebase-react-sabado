// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
//import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBnQ2l-_MBP_xw5WEE18OAirOBh2KRLQVw",
    authDomain: "agenda-sabado-react.firebaseapp.com",
    projectId: "agenda-sabado-react",
    storageBucket: "agenda-sabado-react.appspot.com",
    messagingSenderId: "348963812610",
    appId: "1:348963812610:web:bb7b5909cc54977fc43e1b",
    measurementId: "G-VP6FK93F7X"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);
export default app;
//export const db = getFirestore(app); // exportar la base de datos para usarla en otros archivos