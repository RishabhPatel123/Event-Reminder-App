import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/authContext';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Alert,
  AlertIcon,
  HStack,
} from '@chakra-ui/react';

const EventForm = ({ eventToEdit, onFormSubmit, onClose }) => {
  const [title, setTitle] = useState('');
  const [dateTime, setDateTime] = useState('');
  const [image, setImage] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const { currentUser } = useAuth();

  useEffect(() => {
    if (eventToEdit) {
      setTitle(eventToEdit.title);
      // Format the date for the datetime-local input
      const localDateTime = new Date(eventToEdit.dateTime).toISOString().slice(0, 16);
      setDateTime(localDateTime);
      setImage(eventToEdit.image || '');
    } else {
      setTitle('');
      setDateTime('');
      setImage('');
    }
  }, [eventToEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (!currentUser) {
      setError('You must be logged in.');
      setLoading(false);
      return;
    }

    try {
      const token = await currentUser.getIdToken();
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080';
      const eventData = { title, dateTime, image };
      let response;

      if (eventToEdit) {
        response = await axios.put(`${apiUrl}/api/events/${eventToEdit._id}`, eventData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        response = await axios.post(`${apiUrl}/api/events`, eventData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      setLoading(false);
      if (onFormSubmit) {
        onFormSubmit(response.data);
      }
    } catch (err) {
      console.error('Error submitting event:', err);
      setError(err.response?.data?.error || 'Failed to submit event.');
      setLoading(false);
    }
  };

  return (
    <Box as="form" onSubmit={handleSubmit}>
      <VStack spacing={4}>
        <FormControl isRequired>
          <FormLabel>Title</FormLabel>
          <Input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Date and Time</FormLabel>
          <Input type="datetime-local" value={dateTime} onChange={(e) => setDateTime(e.target.value)} />
        </FormControl>

        <FormControl>
          <FormLabel>Image URL (Optional)</FormLabel>
          <Input type="text" value={image} onChange={(e) => setImage(e.target.value)} />
        </FormControl>

        {error && (
          <Alert status="error">
            <AlertIcon />
            {error}
          </Alert>
        )}

        <HStack width="full" justify="flex-end" pt={4}>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" isLoading={loading} colorScheme="blue">
            {eventToEdit ? 'Update Event' : 'Create Event'}
          </Button>
        </HStack>
      </VStack>
    </Box>
  );
};

export default EventForm;
