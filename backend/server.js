import express from 'express';
import dotenv from 'dotenv';

import authRoutes from './routes/auth.routes.js';
import connectToMongoDb from './db/connectToMongoDB.js';

const app = express();
const PORT = process.env.PORT || 5000;


dotenv.config();

app.use(express.json());//middleware to parse JSON data

//middleware
app.use("/api/auth",authRoutes);

//routes
//app.get('/', (req, res) => {
//  res.send('Hello World!&*');
//});





//port
app.listen(PORT, () => {
    connectToMongoDb();
    console.log(`Server is running on port ${PORT}`);
});



    
    
    
    