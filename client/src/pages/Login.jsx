import React,{useEffect,useState} from 'react';
import {auth} from './firebase';
import {signInWithEmailAndPassword} from 'firebase/auth';

const LogIn =()=>{
    const [email,setEmail] = useState('');
    const [password,setPassword] = useState('');
    const [error,setError] = useState(null);

    const handleLogIn = async(e)=>{
        e.preventDefault();
        setError(null);
        try{
            const userCredential = await signInWithEmailAndPassword(auth,email,password);
            console.log("User Logged in : ",userCredential.user);
            //redirect to nect page
        }catch(err){
            console.err(err.message);
            setError(err.message);
        }
    }

    return(
        <div>
            <h2>Log In</h2>
            <form onSubmit = {handleLogIn}>
                <input type = "email" value ={email}
                onChange = {(e)=>setEmail(e.target.value)}
                placeholder = "Enter Your email"
                required
                />
                <input type = "password" value ={password}
                onChange = {(e)=>setPassword(e.target.value)}
                placeholder = "Enter Your Password"
                required
                />
                <button type="submit">Log In</button>
                {error && <p style={{color:'red'}}>{error}</p>}
            </form>
        </div>
    );
};

export default LogIn;