import express from 'express';
import { register, login, logout } from '../controllers/authController.js';

export function createAuthRoutes(userModel) {
    const router = express.Router();

    router.post('/register', (req, res) => register(req, res, userModel));
    router.post('/login', (req, res) => login(req, res, userModel));
    router.post('/logout', logout);

    return router;
}