import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/authContext';
import {Box,Heading, Button, FormControl, FormLabel, Input,VStack, Alert, AlertIcon} from '@chakra-ui/react';
// This 'onEventCreated'is a function we'll pass from the Dashboard
// to tell the Dashboard to refetch the events list
const EventForm = ({ onEventCreated }) => {
  const [title, setTitle] = useState('');
  const [dateTime, setDateTime] = useState('');
  const [image, setImage] = useState(''); // Optional image URL
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const { currentUser } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (!currentUser) {
      setError('You must be logged in to create an event.');
      setLoading(false);
      return;
    }

    try {
      // Get the user's Firebase auth token
      const token = await currentUser.getIdToken();
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080';
      const response = await axios.post(
        `${apiUrl}/api/events`,
        { title, dateTime, image }, // The data to send
        {
          headers: {
            'Authorization': `Bearer ${token}` // The auth token
          }
        }
      );

      // If successful, clear the form
      setTitle('');
      setDateTime('');
      setImage('');
      setLoading(false);

      // to refetch events
      if (onEventCreated) {
        onEventCreated(response.data); 
      }

    } catch (err) {
      console.error('Error creating event:', err);
      setError(err.response?.data?.error || 'Failed to create event.');
      setLoading(false);
    }
  };

  return (
    <Box as="form" onSubmit={handleSubmit} p={5} borderWidth={1} borderRadius="lg" boxShadow="md">
      <VStack spacing={4}>
        <Heading as="h3" size="md">Create New Event</Heading>
        
        <FormControl isRequired>
          <FormLabel>Title</FormLabel>
          <Input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Date and Time</FormLabel>
          <Input
            type="datetime-local"
            value={dateTime}
            onChange={(e) => setDateTime(e.target.value)}
          />
        </FormControl>

        <FormControl>
          <FormLabel>Image URL (Optional)</FormLabel>
          <Input
            type="text"
            value={image}
            onChange={(e) => setImage(e.target.value)}
          />
        </FormControl>

        {error && (
          <Alert status="error">
            <AlertIcon />
            {error}
          </Alert>
        )}

        <Button type="submit" isLoading={loading} colorScheme="blue" width="full">
          Create Event
        </Button>
      </VStack>
    </Box>
  );
};
export default EventForm;
