
import { initializeApp } from "firebase/app";
import { getFirestore} from "firebase/firestore";



const firebaseConfig = {
  // apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  // authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  // projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  // storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  // messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  // appId: process.env.REACT_APP_FIREBASE_APP_ID
  apiKey:"AIzaSyCyosa8cIEKV-kL02vw1M8U6iSBhrobgOc",
  authDomain: "smoke-point.firebaseapp.com",
  projectId: "smoke-point",
  storageBucket:"smoke-point.appspot.com",
  messagingSenderId:"295290854340",
  appId:"1:295290854340:web:e279ab914e9f5a13036291"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app)