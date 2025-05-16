import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

// Configuración de Firebase (reemplazar con tus propias credenciales)
const firebaseConfig = {
  apiKey: "AIzaSyDVu4Tyi8KzQ7bh9pADfOyxmBemECNiy2s",
  authDomain: "kavak-inspection-3af21.firebaseapp.com",
  projectId: "kavak-inspection-3af21",
  storageBucket: "kavak-inspection-3af21.appspot.com",
  messagingSenderId: "823245543871",
  appId: "1:823245543871:web:b5ed13c1d5d1c1e1a3c2e3"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Obtener una referencia al servicio de almacenamiento
const storage = getStorage(app);

// Obtener una referencia a Firestore
const db = getFirestore(app);

export { storage, app, db }; 