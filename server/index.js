const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const admin = require('firebase-admin');
const webpush = require('web-push');
const cron = require('node-cron');
const eventRoutes = require('./routes/events');
const subscriberRoute = require('./routes/subscribe');
const Event = require('./models/EventSchema');
const Subscription  = require('./models/Subscription');
require('dotenv').config();


//Setup App
const app = express();
const PORT =process.env.PORT || 8080;
const serviceAccount = require('./serviceAccountKey.json');     //Firebase Service accaount key

app.use(cors());
app.use(express.json());    // to understand JSON data

// =======Database Connection=====
mongoose.connect(process.env.MONGO_URI)
                .then(()=> console.log("MongoDb Connected Successfully..."))
                .catch((err)=> console.error("MongoDB connection error : ",err));

//FireBase Admin initialization
admin.initializeApp({
    credential : admin.credential.cert(serviceAccount)
});


//====ROUTES====//
//  all routes handle by our eventRoutes file
app.use('/api/events',eventRoutes);
app.use('/api/subscribe',subscriberRoute);

// Handle 404 not found 
app.use((req,res,next)=>{
    res.status(404).json({error : "Route Not Found"});
    })
    
//===== Web Push SETUP =====

webpush.setVapidDetails(
  `mailto:${process.env}`,
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);


// Runs every 5 minutes
cron.schedule('*/5 * * * *', async () => {
  console.log('Checking for completed events...');
  try {
    const now = new Date();
    // Find events that are in the past and still 'Upcoming'
    const result = await Event.updateMany(
      { dateTime: { $lt: now }, status: 'Upcoming' },
      { $set: { status: 'Completed' } }
    );
    if (result.modifiedCount > 0) {
      console.log(`CRON:  ${result.modifiedCount} events as Completed.`);
    }
  } catch (error) {
    console.error('CRON (Completed): Error:', error);
  }
});

//  CRON Job: Check for event reminders to send Runs every minute
cron.schedule('* * * * *', async () => {
  console.log('CRON: Checking for reminders...');
  try {
    // Calculate the time  29 to 30 minutes from now
    const now = new Date();
    const in30Minutes = new Date(now.getTime() + 30 * 60 * 1000);
    const in29Minutes = new Date(now.getTime() + 29 * 60 * 1000);

    // Find events in this 1-minute gap
    const eventsToSend = await Event.find({
      dateTime: { $gte: in29Minutes, $lte: in30Minutes },
      status: 'Upcoming'
    });

    if (eventsToSend.length > 0) {
      console.log(`CRON (Reminders): Found ${eventsToSend.length} events to send.`);

      for (const event of eventsToSend) {
        // Find the subscription for the user who owns the event
        const subDoc = await Subscription.findOne({ user: event.user });

        if (subDoc) {
          const payload = JSON.stringify({
            title: 'Event Reminder!',
            body: `Your event "${event.title}" is starting in 30 minutes.`,
          });

          try {
            // Send the push notification
            await webpush.sendNotification(subDoc.subscription, payload);
            console.log(`CRON (Reminders): Sent notification for event: ${event.title}`);
          } catch (pushError) {
            if (pushError.statusCode === 410) {
              await Subscription.deleteOne({ _id: subDoc._id });
            } else {
              console.error(`CRON (Reminders): Failed to send push for event ${event._id}:`, pushError);
            }
          }
        }
      }
    }
  } catch (error) {
    console.error('CRON (Reminders): Error:', error);
  }
});

// Start Server
app.listen(PORT,()=>{
    console.log(`Server is running on http://localhost:${PORT}`);
});