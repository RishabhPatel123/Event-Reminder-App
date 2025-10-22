//==== to store a user's notification subscription object in database =====
const mongoose = require('mongoose');

const SubscriptionSchema = new mongoose.Schema({
    user : {
        type : String,
        required : true,
        unique : true,
    },
    subscription : {
        type : Object,
        required : true,
    }
},
{
    timestamps : true
});

module.exports = mongoose.model('Subscription',SubscriptionSchema);