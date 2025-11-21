const server = require('express');
const router = server.Router();
const Event = require('../models/EventSchema');             //Our Event Schema
const decodedToken = require('../middleware/auth');         //middleware auth

//====== Create new Event =====

router.post('/',decodedToken,async(req,res) => {
    try{
        //Extract Event data from body
        const {title,dateTime,image} = req.body;    
        // Get user's id  from token
        const userId = req.user.uid;

        //Create new Event Object 
        const newEvent = new Event({
            user:userId,
            title,
            dateTime,
            image,
            status : 'Upcoming'         //Default Status 
        });

        //Save Event 
        const saveEvent = await newEvent.save();
        res.status(201).json(saveEvent)
    }catch(error){
            console.error("Error in creating event :",error);
            res.status(500).json({error : "Failed to create event."})
    }
});

//===== Get All Event for logged-in user ====
router.get('/', decodedToken, async (req, res) => {
  try {
    const userId = req.user.uid;
    const events = await Event.find({ user: userId }).sort({ dateTime: 1 }); // Sort by date
    res.status(200).json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ error: 'Failed to fetch events.' });
  }
});

// ===== Delete an Event =====
router.delete('/:id', decodedToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.uid;
    const event = await Event.findOneAndDelete({ _id: id, user: userId });
    if (!event) {
      return res.status(404).json({ error: 'Event not found or you do not have permission to delete it.' });
    }
    res.status(200).json({ message: 'Event deleted successfully' });
  } catch (error) {
    console.error('Error deleting event:', error);
    res.status(500).json({ error: 'Failed to delete event.' });
  }
});

// ===== Update an Event =====
router.put('/:id', decodedToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, dateTime, image, status } = req.body;
    const userId = req.user.uid;
    const updatedEvent = await Event.findOneAndUpdate(
      { _id: id, user: userId },
      { title, dateTime, image, status },
      { new: true, runValidators: true }
    );
    if (!updatedEvent) {
      return res.status(404).json({ error: 'Event not found or you do not have permission to edit it.' });
    }
    res.status(200).json(updatedEvent);
  } catch (error) {
    console.error('Error updating event:', error);
    res.status(500).json({ error: 'Failed to update event.' });
  }
});


//Homepage route
router.get('/public',async(req,res) => {
  try{
    const upComingEvents = await Event.find( {status : 'Upcoming'}).sort({dateTime:1}).limit(6);
    res.status(200).json(upComingEvents);
  }catch(error){
    console.error("Error in Fetching Public Events.",error);
    res.status(500).json({error : "Failed to fetch public events."})
  }

});

module.exports = router;
