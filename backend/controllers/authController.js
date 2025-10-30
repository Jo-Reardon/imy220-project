import User from '../models/User.js';

export async function register(req, res, userModel) {
    try {
        const { username, email, password, name, bio } = req.body;

        // Validation
        if (!username || !email || !password || !name) {
            return res.status(400).json({ message: 'Username, email, password, and name are required' });
        }

        // Check if user exists
        const existingUser = await userModel.findByEmail(email);
        if (existingUser) {
            return res.status(400).json({ message: 'Email already registered' });
        }

        const existingUsername = await userModel.findByUsername(username);
        if (existingUsername) {
            return res.status(400).json({ message: 'Username already taken' });
        }

        // Create user with all fields
        const user = await userModel.create({ 
            username, 
            email, 
            password, 
            name,
            bio: bio || '' // Optional field, default to empty string
        });
        
        // Remove password from response
        delete user.password;

        res.status(201).json({ 
            success: true, 
            user,
            message: 'User registered successfully' 
        });
    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({ message: 'Server error during registration' });
    }
}

export async function login(req, res, userModel) {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password required' });
        }

        const user = await userModel.findByEmail(email);
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // In production, use bcrypt.compare()
        if (user.password !== password) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        delete user.password;

        res.json({ 
            success: true, 
            user,
            message: 'Login successful' 
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error during login' });
    }
}

export function logout(req, res) {
    res.json({ success: true, message: 'Logged out successfully' });
}