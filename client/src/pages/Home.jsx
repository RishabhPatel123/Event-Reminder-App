import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import TimeWidget from '../components/TimeWidget';
import WeatherWidget from '../components/WeatherWidget';
import {Box, Heading, SimpleGrid, Image, Text, Badge,HStack, VStack, useColorModeValue} from '@chakra-ui/react';
import '../App.css'; 

const MotionBox = motion.create(Box);


const Home = () => {
  const [publicEvents, setPublicEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPublicEvents = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080';
        const response = await axios.get(`${apiUrl}/api/events/public`);
        setPublicEvents(response.data);
      } catch (err) {
        console.error('Error fetching public events:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPublicEvents();
  }, []);

  const cardBg = useColorModeValue('white', 'gray.700');
  const cardColor = useColorModeValue('gray.800', 'white');

  return (
    <Box
      minH="100vh"
      p={10}
      color="white"
      bgGradient="linear(to-br, #4e54c8, #8f94fb)" 
    >
      
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Heading as="h1" size="2xl" mb={6}>
          Welcome to Event Reminder
        </Heading>
      </motion.div>


      <Box
        bg="rgba(255, 255, 255, 0.1)"
        p={6}
        borderRadius="lg"
        mb={10}
      >
        <HStack justify="space-between">
          <TimeWidget />
          <WeatherWidget />
        </HStack>
      </Box>

      <Heading as="h2" size="xl" mb={6}>Upcoming Events</Heading>
      {loading ? (
        <Text>Loading events...</Text>
      ) : (
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
          {publicEvents.map(event => (
            <MotionBox
              key={event._id}
              bg={cardBg}
              color={cardColor}
              borderRadius="lg"
              boxShadow="lg"
              overflow="hidden"
              whileHover={{ scale: 1.05, boxShadow: '0 8px 30px rgba(0, 0, 0, 0.2)' }}
            >
              <Image
                src={event.image || 'https://placehold.co/150.png'}
                alt={event.title}
                h="200px"
                w="100%"
                objectFit="cover"
              />
              <Box p={5}>
                <Badge colorScheme={event.status === 'Upcoming' ? 'green' : 'gray'}>
                  {event.status}
                </Badge>
                <Heading as="h4" size="md" mt={2} noOfLines={1}>
                  {event.title}
                </Heading>
                <Text fontSize="sm" color="gray.500" mt={2}>
                  {new Date(event.dateTime).toLocaleString()}
                </Text>
              </Box>
            </MotionBox>
          ))}
        </SimpleGrid>
      )}
    </Box>
  );
};
export default Home;