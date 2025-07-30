// src/routes/auth.routes.js (Tusaale ahaan, haddii aad leedahay)
import express from 'express';
import { register, login } from '../auth/auth.controller.js';
// import { authenticateToken } from '../auth/auth.middleware.js'; // Waxaad tan isticmaali doontaa routes kale, ma ahan register/login

const router = express.Router();

router.post('/register', register);
router.post('/login', login);

export default router;