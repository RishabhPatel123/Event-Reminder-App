import React,{useState,useEffect} from 'react';
//import {auth} from '../firebase';
import {auth} from './firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';

const SignUp = () => {
    const [email,setEmail] = useState('');
    const [password,setPassword] = useState('');
    const [error,setError] = useState(null);

    //Handle SignUP
    const handleSignUp = async(e) => {
        e.preventDefault();     //Prevent the form from refreshing the page
        setError(null);         // clear any previous error
        try{
            const userCredential = await createUserWithEmailAndPassword(auth,email,password);
            console.log("User Signed up :",userCredential.user);
        }catch(err){
            console.err(err.message);
            setError(err.message);  // Show error to user
        }
    };

    return (
        <div>
            <h2>Sign Up</h2>
            <form onSubmit={handleSignUp} >
                <input type="email" value={email} 
                onChange={(e)=>setEmail(e.target.value)}
                placeholder = "Enter Your email"
                required 
                />
                <input type = "password" value = {password}
                onChange = {(e)=>setPassword(e.target.value)}
                placeholder="Enter Your Password"
                required
                />
                <button type="submit">Sign Up</button>
                {error && <p style={{color:'red'}}>{error}</p>}
            </form>
        </div>
    );
};

export default SignUp;