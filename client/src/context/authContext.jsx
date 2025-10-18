import React,{createContext,useContext,useState,useEffect} from 'react';
import {auth} from '../pages/firebase';
import {onAuthStateChanged,signOut} from 'firebase/auth';

const AuthContext = createContext();
export const useAuth = () => {return useContext(AuthContext)};

export const AuthProvider = ({ children }) =>{
    const [currentUser, setCurrentUser] = useState(null);
    const [loading,setLoading] = useState(null);

    // Firebase listener
    useEffect(()=>{
        const unsubscribe = onAuthStateChanged(auth,(user)=>{
            setCurrentUser(user);
            setLoading(false);
        });
        return unsubscribe;
    });

    //Function to Logout
    const logout = () =>{
        return signOut(auth);
    };

    const value = {
        currentUser,
        logout
    };
    
    return(
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};