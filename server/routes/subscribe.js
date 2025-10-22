const express = require('express');
const router = express.Router();
const Subscription = require('../models/Subscription');
const decodeToken = require('../middleware/auth');

// This route is protected. A user must be logged in.
router.post('/', decodeToken, async (req, res) => {
  try {
    const userId = req.user.uid;
    const sub = req.body.subscription; 

    if (!sub) {
      return res.status(400).json({ error: 'Subscription object is required.' });
    }

    const savedSubscription = await Subscription.findOneAndUpdate(
      { user: userId }, // Find by user ID
      { user: userId, subscription: sub }, // The new data
      { upsert: true, new: true } //Find existing one if not , create new 
    );

    res.status(201).json(savedSubscription);
  } catch (error) {
    console.error('Error saving subscription:', error);
    res.status(500).json({ error: 'Failed to save subscription.' });
  }
});

module.exports = router;