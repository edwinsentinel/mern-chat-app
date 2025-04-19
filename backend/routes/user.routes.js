import express from 'express';

import protectRoute from '../middleware/protectRoute.js';
import { getUsersForSidebar } from '../controllers/user.controller.js';
 // Import the middleware  for authentication

const router = express.Router();

router.get('/', protectRoute,getUsersForSidebar);


export default router;
