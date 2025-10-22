const admin = require('firebase-admin');

// Middleware function that check every api request  before database
const decodeToken = async(req,res,next) =>{
    const authHeader = req.headers.authorization;
    
    //check if auth header exists
    if (authHeader && authHeader.startsWith('Bearer')){
        const idToken = authHeader.split('Bearer ')[1];
        try{
            const decodeToken = await admin.auth().verifyIdToken(idToken);
            req.user = decodeToken;
            return next();
        }catch(error){
            console.error("Error While verifying token : ",error);
            return res.status(401).json({error : "Unauthrozied. Invalid Token"})
        }
    }

    //if no token is provided
    return res.status(401).json({error : "Unauthorized. no token provided  "});
};

    module.exports = decodeToken;