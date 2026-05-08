import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

export const getInstrumentos = async () => {
  const querySnapshot = await getDocs(collection(db, "instrumentos"));
  const instrumentos = [];
  querySnapshot.forEach((doc) => {
    instrumentos.push({ id: doc.id, ...doc.data() });
  });
  return instrumentos;
};
