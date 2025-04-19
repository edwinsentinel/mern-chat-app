import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes.js';

const app = express();

dotenv.config();
const PORT = process.env.PORT || 5000;

//routes
app.get('/', (req, res) => {
  res.send('Hello World!&*');
});


//middleware
app.use("/api/auth",authRoutes);


//port
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));