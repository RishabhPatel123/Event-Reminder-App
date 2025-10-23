import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { useAuth } from '../context/authContext';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion'; 
import { subscribeToPushNotifications } from '../Notifications';
import EventForm from '../components/EventForm';
import {Box, Button, Heading, Text, VStack, HStack, SimpleGrid,Image, Badge, useColorModeValue, Alert, AlertIcon, Spinner, Container, ButtonGroup
} from '@chakra-ui/react';

const MotionBox = motion.create(Box);

const Dashboard = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('All'); 
  const [isFormVisible, setIsFormVisible] = useState(false); 

  // Function to fetch events from the API
  const fetchEvents = async () => {
    if (!currentUser) return;
    setLoading(true);
    try {
      const token = await currentUser.getIdToken();
      const apiUrl = 'http://localhost:8080';
      const response = await axios.get(`${apiUrl}/api/events`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setEvents(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching events:', err);
      setError(err.response?.data?.error || 'Failed to fetch events.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch events when the component loads
  useEffect(() => {
    fetchEvents();
  }, [currentUser]);

  // This function will be passed to EventForm
  const handleEventCreated = (newEvent) => {
    setEvents([...events, newEvent]); // Add new event to the list
    setIsFormVisible(false); // Hide the form after creation
  };

  // --- Stats Calculations ---
  const filteredEvents = useMemo(() => {
    if (filter === 'Upcoming') {
      return events.filter(event => event.Status === 'Upcoming');
    }
    if (filter === 'Completed') {
      return events.filter(event => event.Status === 'Completed');
    }
    return events;
  }, [events, filter]);

  const stats = useMemo(() => ({
    total: events.length,
    upcoming: events.filter(event => event.Status === 'Upcoming').length,
    completed: events.filter(event => event.Status === 'Completed').length,
  }), [events]);
  // --- End Stats ---

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  //Handle Subscription
  const handleSubscribe = async () => {
  try {
    const subscription = await subscribeToPushNotifications();

    if (subscription) {
      const token = await currentUser.getIdToken();
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080';
      await axios.post(
        `${apiUrl}/api/subscribe`,
        { subscription }, 
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      alert('Successfully subscribed to notifications!');
    }
  } catch (error) {
    console.error('Error subscribing to notifications:', error);
    alert('Failed to subscribe. See console for details.');
  }
};

  // --- Animation  for the form ---
  const formVariants = {
    hidden: { opacity: 0, y: -50, height: 0 },
    visible: { opacity: 1, y: 0, height: 'auto', transition: { duration: 0.3 } },
    exit: { opacity: 0, y: -50, height: 0, transition: { duration: 0.3 } }
  };

  const cardBg = useColorModeValue('white', 'gray.700');
  const cardColor = useColorModeValue('gray.800', 'white');

  return (
    <Container maxW="container.xl" py={10}>
      <HStack justify="space-between" mb={6}>
        <Heading as="h2" size="lg">Dashboard</Heading>
        <HStack>
          <Button onClick={handleSubscribe} colorScheme="green">
            Enable Notifications
          </Button>
          <Button onClick={handleLogout}>Log Out</Button>
        </HStack>
      </HStack>
      <Text fontSize="lg" mb={6}>Welcome, <strong>{currentUser.email}</strong>!</Text>

      {/* Stats Cards */}
      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={5} mb={6}>
        <StatBox label="Total Events" value={stats.total} />
        <StatBox label="Active Events" value={stats.upcoming} />
        <StatBox label="Completed Events" value={stats.completed} />
      </SimpleGrid>

      {/* Event Creation Micro-interaction */}
      <Button onClick={() => setIsFormVisible(!isFormVisible)} colorScheme="blue" mb={6}>
        {isFormVisible ? 'Cancel' : 'Create New Event +'}
      </Button>

      <AnimatePresence>
        {isFormVisible && (
          <MotionBox
            key="event-form"
            variants={formVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            style={{ overflow: 'hidden', marginBottom: '24px' }}
          >
            <EventForm onEventCreated={handleEventCreated} />
          </MotionBox>
        )}
      </AnimatePresence>
      
      {/* Event List & Filters */}
      <Box>
        <Heading as="h3" size="md" mb={4}>Your Events</Heading>
        <ButtonGroup isAttached mb={4}>
          <Button onClick={() => setFilter('All')} isActive={filter === 'All'}>All</Button>
          <Button onClick={() => setFilter('Active')} isActive={filter === 'Upcoming'}>Active</Button>
          <Button onClick={() => setFilter('Completed')} isActive={filter === 'Completed'}>Completed</Button>
        </ButtonGroup>

        {loading && <Spinner size="xl" />}
        {error && (
          <Alert status="error">
            <AlertIcon />
            {error}
          </Alert>
        )}
        
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
          {!loading && filteredEvents.length === 0 && <Text>No events found.</Text>}
          
          {filteredEvents.map(event => (
            <Box
              key={event._id}
              bg={cardBg}
              color={cardColor}
              borderRadius="lg"
              boxShadow="md"
              overflow="hidden"
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
            </Box>
          ))}
        </SimpleGrid>
      </Box>
    </Container>
  );
};

const StatBox = ({ label, value }) => (
  <Box p={5} shadow="md" borderWidth="1px" borderRadius="lg">
    <Text fontSize="sm" color="gray.500">{label}</Text>
    <Heading size="lg">{value}</Heading>
  </Box>
);
export default Dashboard;