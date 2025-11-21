import React from 'react';
import { BrowserRouter, Routes, Route, Link as RouterLink, Navigate ,useLocation} from 'react-router-dom';
import { Box, HStack, Button, Spacer, Heading } from '@chakra-ui/react';
import { useAuth } from './context/authContext';
import ProtectedRoute from './ProtectedRoute';
//====Pages import 
import SignUp from './pages/SignUp';
import LogIn from './pages/Login';
import Dashboard  from './pages/dashboard';
import Home from './pages/Home';

//We'll  Implement page later
//const Home = () => <div><h2>Home Page</h2><p>This is the public home page.</p></div>;

const AppContent =() => {
  const {currentUser,logout} = useAuth();
  const location = useLocation();
  const pathname = location.pathname;

  return(
    <>
      <Box bg="gray.100" p={4}>
        <HStack as="nav" spacing={4} align="center">
          <Heading as={RouterLink} to="/" size="md" color="blue.600">
            EventReminder
          </Heading>
          <Spacer /> 

          <Button as={RouterLink} to="/"  variant={pathname === "/" ? "solid" : "ghost"} colorScheme={pathname === "/" ? "blue" : "gray"}>
            Home
          </Button>

          {currentUser ? (
            <>
              <Button as={RouterLink} to="/dashboard" variant={pathname === "/dashboard" ? "solid" : "ghost"} colorScheme={pathname === "/dashboard" ? "blue" : "gray"}>
                Dashboard
              </Button>
              <Button onClick={logout} variant="ghost">
                Log Out
              </Button>
            </>
          ) : (
            <>
              <Button as={RouterLink} to="/login"  variant={pathname === "/login" ? "solid" : "ghost"} colorScheme={pathname === "/login" ? "blue" : "gray"}>
                Login
              </Button>
              <Button as={RouterLink} to="/signup"  variant={pathname === "/signup" ? "solid" : "ghost"} colorScheme={pathname === "/signup" ? "blue" : "gray"}>
                Sign Up
              </Button>
            </>
          )}
        </HStack>
      </Box>
      <Routes>
        { <Route path="/" element={<Home />} />}
        <Route path="/signup" element={currentUser ? <Navigate to="/dashboard" /> : <SignUp />} />
        <Route path="/login" element={currentUser ? <Navigate to="/dashboard" /> : <LogIn />} />

        {/* This is our protected route */}
        <Route path="/dashboard" element={
           <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
      </Routes>      
    </>
  );
}
//=====Main App Component =====
function App(){
  return(
  <BrowserRouter>
    <AppContent />
  </BrowserRouter>
  );
}

export default App;
