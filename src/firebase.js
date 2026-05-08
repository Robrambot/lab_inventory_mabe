// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDlPWhdj7o68vcZCw04Md5J9cw5Wni00eE",
  authDomain: "labinventory-1efec.firebaseapp.com",
  projectId: "labinventory-1efec",
  storageBucket: "labinventory-1efec.appspot.com",
  messagingSenderId: "894409453904",
  appId: "1:894409453904:web:778f13fb3f2a7a9eeabc55",
  measurementId: "G-F4XXYD67QY"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

export { db, storage };
