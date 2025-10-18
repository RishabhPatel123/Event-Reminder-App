 const express = require('express');
const cors = require('cors');

//Setup App
const app = express();
const PORT = 8080;

app.use(cors());
app.use(express.json());    // to understand JSON data

//====ROUTES====//

app.get('/api/test',(req,res)=>{
    res.status(200).json({message:'Hello from server'});
});


// Start Server
app.listen(PORT,()=>{
    console.log(`Server is running on http://localhost:${PORT}`);
});