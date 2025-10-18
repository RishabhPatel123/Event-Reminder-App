import { initializeApp} from "firebase/app"; 
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_apiKey,
  authDomain: import.meta.env.VITE_authDomain,
  databaseURL: import.meta.env.VITE_databaseURL,
  projectId: import.meta.env.VITE_projectId,
  storageBucket: import.meta.env.VITE_storageBucket,
  messagingSenderId: import.meta.env.VITE_messagingSenderId,
  appId: import.meta.env.VITE_appId,
  //measurementId: "G-16X6CQBT7H"
};

const app =  initializeApp(firebaseConfig) ;

// Now we can safely get the auth service
const auth = getAuth(app);

// And export it
export { auth };