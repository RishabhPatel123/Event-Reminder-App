import React,{useEffect,useState} from 'react';
import {auth} from './firebase';
import {signInWithEmailAndPassword} from 'firebase/auth';
import {Box, Button, FormControl,FormLabel, Input, Heading, Text,VStack, Container, Alert,AlertIcon } from '@chakra-ui/react';
import { useNavigate,Link, Form } from 'react-router-dom';

const LogIn =()=>{
    const [email,setEmail] = useState('');
    const [password,setPassword] = useState('');
    const [error,setError] = useState(null);
    const naviagte = useNavigate();

    const handleLogIn = async(e)=>{
        e.preventDefault();
        setError(null);
        try{
            const userCredential = await signInWithEmailAndPassword(auth,email,password);
            naviagte('/dashboard');
        }catch(err){
            //console.error(err.message);
            setError(err.message);
        }
    }

    return(
        <Container centerContent>
            <Box
                w="100%"
                maxW = "md"
                p = {8}
                mt = {10}
                borderWidth = {1}
                borderRadius = "lg"
                boxShadow="lg"
                >
                <VStack spacing={4}>
                    <Heading as="h2" size = "lg">Log In</Heading>
                    <form onSubmit = {handleLogIn}>
                        <VStack spacing={8}>
                            <FormControl isRequired>
                                <FormLabel>Email address</FormLabel>
                                <Input type = "email" value ={email}
                                onChange = {(e)=>setEmail(e.target.value)}
                                placeholder = "Enter Your email"
                                />
                            </FormControl>
                            <FormControl isRequired>
                                <FormLabel>Email address</FormLabel>
                                <Input type = "password" value ={password}
                                onChange = {(e)=>setPassword(e.target.value)}
                                placeholder = "Enter Your Password"
                                />
                            </FormControl>
                            {
                                error && (
                                    <Alert>
                                        <AlertIcon />
                                        {error}
                                    </Alert>
                                )
                            }
                            <Button type="submit" colorScheme="blue" width="full" >Log In</Button>
                        </VStack>
                        <Text>
                             Don't have an account? <Link to="/signup" style={{ color: '#3182CE' }}>Sign Up</Link>
                        </Text>
                    </form>
                </VStack>
            </Box>
        </Container>
    );
};

export default LogIn;