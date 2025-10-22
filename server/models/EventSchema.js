const mongoose = require("mongoose");

// Creating database Scheema
const schema = new mongoose.Schema({
    user:{
        type:String,
        required:true,
    },
    title:{
        type:String,
        required:true,
        },
    dateTime:{
        type:Date,
        required:true,
    },
    image:{
        type:String,
        required:false,
    },
    Status:{
        type:String,
        enum:['Upcoming','Completed'],   // only allows two values
        default:'Upcoming',     //Set default event status to upcoming
    },
},{
        timestamps:true,    //automatically create time
    });


module.exports = mongoose.model('Event',schema);