import React from 'react';
import {BrowserRouter,Routes,Route,Link,Navigate} from 'react-router-dom';
import { useAuth } from './context/authContext';
import SignUp from './pages/SignUP';
import LogIn from './pages/LogIn';
import Dashboard  from './pages/dashboard';
import ProtectedRoute from './ProtectedRoute';

//We'll  Implement page later
const Home = () => <div><h2>Home Page</h2><p>This is the public home page.</p></div>;

function App(){
  const {currentUser} = useAuth();
  return(
    <BrowserRouter>
      <nav>
        <Link to="/">Home</Link> | <Link to="/signup">Sign Up</Link> |{" "}
        {currentUser ? (
          <Link to="/dashboard">Dashboard</Link>
        ) : (
          <Link to="/login">Login</Link>
        )}
      </nav>
      <Routes>
        { <Route path="/" element={<Home />} />}

        {/* If user is logged in, /login and /signup redirect to dashboard */}
        <Route path="/signup" element={currentUser ? <Navigate to="/dashboard" /> : <SignUp />} />
        <Route path="/login" element={currentUser ? <Navigate to="/dashboard" /> : <LogIn />} />

        {/* This is our protected route */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
      </Routes>      
    </BrowserRouter>
  );
}

export default App;