import { collection, getDocs, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";

export const getInstrumentos = async () => {
  const querySnapshot = await getDocs(collection(db, "instrumentos"));
  const instrumentos = [];
  querySnapshot.forEach((doc) => {
    instrumentos.push({ id: doc.id, ...doc.data() });
  });
  return instrumentos;
};

export const addInstrumento = async (instrumentoData) => {
  try {
    const docRef = await addDoc(collection(db, "instrumentos"), {
      ...instrumentoData,
      estado: "disponible", // Estado por defecto
      fechaCreacion: serverTimestamp(),
      activo: true,
    });
    return docRef.id;
  } catch (error) {
    console.error("Error al añadir el instrumento: ", error);
    throw new Error('No se pudo guardar el nuevo instrumento.');
  }
};
