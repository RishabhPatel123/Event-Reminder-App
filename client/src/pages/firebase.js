import { initializeApp} from "firebase/app"; 
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAwmqG3Lw-SVwks5HV-PfeE8P_e_oBdon8",
  authDomain: "hackapp-1dc5d.firebaseapp.com",
  databaseURL: "https://hackapp-1dc5d-default-rtdb.firebaseio.com",
  projectId: "hackapp-1dc5d",
  storageBucket: "hackapp-1dc5d.firebasestorage.app",
  messagingSenderId: "485679819428",
  appId: "1:485679819428:web:1fd11f6eaa059770041431",
  //measurementId: "G-16X6CQBT7H"
};

const app =  initializeApp(firebaseConfig) ;

// Now we can safely get the auth service
const auth = getAuth(app);

// And export it
export { auth };