import React,{useState,useEffect} from 'react';
import {auth} from './firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import {Box, Button, FormControl, FormLabel, Input, Heading, Text,VStack, Container, Alert, AlertIcon} from '@chakra-ui/react';
import { Link, useNavigate } from 'react-router-dom';


const SignUp = () => {
    const [email,setEmail] = useState('');
    const [password,setPassword] = useState('');
    const [error,setError] = useState(null);
    const navigate = useNavigate();

    //Handle SignUP
    const handleSignUp = async(e) => {
        e.preventDefault();     //Prevent the form from refreshing the page
        setError(null);         // clear any previous error
        try{
            const userCredential = await createUserWithEmailAndPassword(auth,email,password);
            navigate('/dashboard');
            //console.log("User Signed up :",userCredential.user);
        }catch(err){
            //console.err(err.message);
            setError(err.message);  // Show error to user
        }
    };

    return (
    <Container centerContent>
      <Box
        w="100%"
        maxW="md"
        p={8}
        mt={10}
        borderWidth={1}
        borderRadius="lg"
        boxShadow="lg"
      >
        <VStack spacing={4}>
          <Heading as="h2" size="lg">Sign Up</Heading>
          <form onSubmit={handleSignUp} style={{ width: '100%' }}>
            <VStack spacing={8}>
              <FormControl isRequired>
                <FormLabel>Email address</FormLabel>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Password</FormLabel>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter a password (min. 6 chars)"
                />
              </FormControl>
              
              {error && (
                <Alert status="error">
                  <AlertIcon />
                  {error}
                </Alert>
              )}
              
              <Button type="submit" colorScheme="blue" width="full">
                Sign Up
              </Button>
            </VStack>
          </form>
          <Text>
            Already have an account? <Link to="/login" style={{ color: '#3182CE' }}>Login</Link>
          </Text>
        </VStack>
      </Box>
    </Container>
  );
}
export default SignUp;