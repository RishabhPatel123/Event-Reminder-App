import React, { useState, useEffect, useMemo, useRef } from 'react';
import axios from 'axios';
import { useAuth } from '../context/authContext';
import { useNavigate } from 'react-router-dom';
import EventForm from '../components/EventForm';
import { subscribeToPushNotifications } from '../Notifications';
import { EditIcon, DeleteIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Heading,
  Text,
  HStack,
  SimpleGrid,
  Image,
  Badge,
  useColorModeValue,
  Alert,
  AlertIcon,
  Spinner,
  Container,
  ButtonGroup,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  IconButton,
  Flex,
} from '@chakra-ui/react';

const Dashboard = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('All');
  const [editingEvent, setEditingEvent] = useState(null);
  const [eventToDelete, setEventToDelete] = useState(null);

  const { isOpen: isFormOpen, onOpen: onFormOpen, onClose: onFormClose } = useDisclosure();
  const {
    isOpen: isAlertOpen,
    onOpen: onAlertOpen,
    onClose: onAlertClose,
  } = useDisclosure();
  const cancelRef = useRef();

  const fetchEvents = async () => {
    if (!currentUser) return;
    setLoading(true);
    try {
      const token = await currentUser.getIdToken();
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080';
      const response = await axios.get(`${apiUrl}/api/events`, {
        headers: { Authorization: `Bearer ${token}` },
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

  useEffect(() => {
    fetchEvents();
  }, [currentUser]);

  const handleFormSubmit = (eventData) => {
    if (editingEvent) {
      handleEventUpdated(eventData);
    } else {
      handleEventCreated(eventData);
    }
  };

  const handleEventCreated = (newEvent) => {
    setEvents([...events, newEvent]);
    toast({ title: 'Event created successfully', status: 'success', duration: 3000, isClosable: true });
    onFormClose();
  };

  const handleEventUpdated = (updatedEvent) => {
    setEvents(events.map(e => e._id === updatedEvent._id ? updatedEvent : e));
    toast({ title: 'Event updated successfully', status: 'success', duration: 3000, isClosable: true });
    onFormClose();
    setEditingEvent(null);
  }

  const handleDelete = async () => {
    try {
      const token = await currentUser.getIdToken();
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080';
      await axios.delete(`${apiUrl}/api/events/${eventToDelete._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEvents(events.filter(e => e._id !== eventToDelete._id));
      toast({ title: 'Event deleted successfully', status: 'success', duration: 3000, isClosable: true });
      onAlertClose();
      setEventToDelete(null);
    } catch (err) {
      console.error('Error deleting event:', err);
      toast({ title: 'Failed to delete event', status: 'error', duration: 3000, isClosable: true });
    }
  };

  const handleSubscribe = async () => {
    try {
      const subscription = await subscribeToPushNotifications();
      if (subscription) {
        const token = await currentUser.getIdToken();
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080';
        await axios.post(
          `${apiUrl}/api/subscribe`,
          { subscription },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast({ title: 'Subscribed to notifications!', status: 'success', duration: 3000, isClosable: true });
      }
    } catch (error) {
      console.error('Error subscribing:', error);
      toast({ title: 'Failed to subscribe', description: error.message, status: 'error', duration: 3000, isClosable: true });
    }
  };

  const openCreateForm = () => {
    setEditingEvent(null);
    onFormOpen();
  };

  const openEditForm = (event) => {
    setEditingEvent(event);
    onFormOpen();
  };

  const openDeleteAlert = (event) => {
    setEventToDelete(event);
    onAlertOpen();
  };

  const filteredEvents = useMemo(() => {
    if (filter === 'Upcoming') return events.filter(e => e.Status === 'Upcoming');
    if (filter === 'Completed') return events.filter(e => e.Status === 'Completed');
    return events;
  }, [events, filter]);

  const stats = useMemo(() => ({
    total: events.length,
    upcoming: events.filter(e => e.Status === 'Upcoming').length,
    completed: events.filter(e => e.Status === 'Completed').length,
  }), [events]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out:', error);
    }
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

      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={5} mb={6}>
        <StatBox label="Total Events" value={stats.total} />
        <StatBox label="Active Events" value={stats.upcoming} />
        <StatBox label="Completed Events" value={stats.completed} />
      </SimpleGrid>

      <Flex justify="space-between" align="center" mb={6}>
        <Heading as="h3" size="md">Your Events</Heading>
        <Button onClick={openCreateForm} colorScheme="blue">
          Create New Event +
        </Button>
      </Flex>

      <ButtonGroup isAttached mb={4}>
        <Button onClick={() => setFilter('All')} isActive={filter === 'All'}>All</Button>
        <Button onClick={() => setFilter('Upcoming')} isActive={filter === 'Upcoming'}>Active</Button>
        <Button onClick={() => setFilter('Completed')} isActive={filter === 'Completed'}>Completed</Button>
      </ButtonGroup>

      {loading && <Spinner size="xl" />}
      {error && <Alert status="error"><AlertIcon />{error}</Alert>}

      {!loading && filteredEvents.length === 0 ? (
        <Text>No events found. Click "Create New Event" to add one!</Text>
      ) : (
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
          {filteredEvents.map(event => (
            <Box key={event._id} bg={cardBg} color={cardColor} borderRadius="lg" boxShadow="md" overflow="hidden">
              <Image src={event.image || 'https://placehold.co/150.png'} alt={event.title} h="200px" w="100%" objectFit="cover" />
              <Box p={5}>
                <Badge colorScheme={event.Status === 'Upcoming' ? 'green' : 'gray'}>{event.Status}</Badge>
                <Heading as="h4" size="md" mt={2} noOfLines={1}>{event.title}</Heading>
                <Text fontSize="sm" color="gray.500" mt={2}>{new Date(event.dateTime).toLocaleString()}</Text>
                <HStack justify="flex-end" mt={4}>
                  <IconButton icon={<EditIcon />} aria-label="Edit Event" onClick={() => openEditForm(event)} />
                  <IconButton icon={<DeleteIcon />} aria-label="Delete Event" colorScheme="red" onClick={() => openDeleteAlert(event)} />
                </HStack>
              </Box>
            </Box>
          ))}
        </SimpleGrid>
      )}

      <Modal isOpen={isFormOpen} onClose={onFormClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{editingEvent ? 'Edit Event' : 'Create a New Event'}</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <EventForm 
              eventToEdit={editingEvent} 
              onFormSubmit={handleFormSubmit} 
              onClose={onFormClose} 
            />
          </ModalBody>
        </ModalContent>
      </Modal>

      <AlertDialog isOpen={isAlertOpen} leastDestructiveRef={cancelRef} onClose={onAlertClose}>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">Delete Event</AlertDialogHeader>
            <AlertDialogBody>Are you sure you want to delete "{eventToDelete?.title}"? This action cannot be undone.</AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onAlertClose}>Cancel</Button>
              <Button colorScheme="red" onClick={handleDelete} ml={3}>Delete</Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
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