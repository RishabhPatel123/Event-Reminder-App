import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import TimeWidget from '../components/TimeWidget';
import WeatherWidget from '../components/WeatherWidget';
import {
  Box,
  Heading,
  SimpleGrid,
  Image,
  Text,
  Badge,
  useColorModeValue,
  Flex,
  Skeleton,
  SkeletonText,
} from '@chakra-ui/react';
import '../App.css';

const MotionBox = motion(Box);

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

  const renderSkeleton = () => (
    <Box
      bg={cardBg}
      borderRadius="lg"
      boxShadow="lg"
      overflow="hidden"
      p={5}
    >
      <Skeleton height="200px" />
      <SkeletonText mt="4" noOfLines={3} spacing="4" />
    </Box>
  );

  return (
    <Box
      minH="100vh"
      p={{ base: 4, md: 10 }}
      color="white"
      bgGradient="linear(to-br, #4e54c8, #8f94fb)"
    >
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Heading as="h1" size="2xl" mb={6} textAlign="center">
          Welcome to Event Reminder
        </Heading>
      </motion.div>

      <Box
        bg="rgba(255, 255, 255, 0.1)"
        p={6}
        borderRadius="lg"
        mb={10}
        sx={{ backdropFilter: 'blur(10px)' }}
        border="1px"
        borderColor="rgba(255, 255, 255, 0.18)"
      >
        <Flex
          justify="space-between"
          align="center"
          direction={{ base: 'column', md: 'row' }}
          gap={{ base: 4, md: 0 }}
        >
          <TimeWidget />
          <WeatherWidget />
        </Flex>
      </Box>

      <Heading as="h2" size="xl" mb={6} textAlign="center">
        Upcoming Events
      </Heading>
      
      {loading ? (
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
          {Array.from({ length: 3 }).map((_, i) => renderSkeleton())}
        </SimpleGrid>
      ) : publicEvents.length > 0 ? (
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
          {publicEvents.map((event, i) => (
            <MotionBox
              key={event._id}
              bg={cardBg}
              color={cardColor}
              borderRadius="lg"
              boxShadow="lg"
              overflow="hidden"
              whileHover={{ scale: 1.05, boxShadow: '0 8px 30px rgba(0, 0, 0, 0.2)' }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
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
      ) : (
        <Box textAlign="center" py={10} px={6}>
          <Heading as="h2" size="xl" mt={6} mb={2}>
            No Upcoming Events
          </Heading>
          <Text color={'gray.300'}>
            Check back later or log in to create your own events!
          </Text>
        </Box>
      )}
    </Box>
  );
};

export default Home;
