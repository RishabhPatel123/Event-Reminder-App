const server = require('express');
const router = server.Router();
const Event = require('../models/EventSchema');             //Our Event Schema
const decodedToken = require('../middleware/auth');         //middleware auth

//====== Create new Event =====

router.post('/',decodedToken,async(req,res) =>{
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
            Status : 'Upcoming'         //Default Status 
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

//Homepage route
router.get('/public',async(req,res) =>{
  try{
    const upComingEvents = await Event.find( {Status : 'Upcoming'}).sort({dateTime:1}).limit(6);
    res.status(200).json(upComingEvents);
  }catch(error){
    console.error("Error in Fetching Public Events.",error);
    res.status(500).json({error : "Failed to fetch public events."})
  }

});

module.exports = router;