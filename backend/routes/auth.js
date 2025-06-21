import express from 'express';
import Joi from 'joi';
import { 
  createUser, 
  getUserByEmail, 
  validatePassword, 
  generateToken,
  updateUser 
} from '../services/userService.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

const signupSchema = Joi.object({
  name: Joi.string().min(2).max(50).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

const profileUpdateSchema = Joi.object({
  name: Joi.string().min(2).max(50),
  skinTone: Joi.string().valid('Very Fair', 'Fair', 'Light', 'Medium', 'Tan', 'Deep', 'Very Deep'),
  bodyType: Joi.string().valid('Pear', 'Apple', 'Hourglass', 'Rectangle', 'Inverted Triangle'),
  preferredStyle: Joi.string().valid('Casual', 'Business', 'Formal', 'Bohemian', 'Minimalist', 'Trendy', 'Classic'),
});

// Signup
router.post('/signup', async (req, res, next) => {
  try {
    const { error, value } = signupSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    // Check if user already exists
    const existingUser = await getUserByEmail(value.email);
    if (existingUser) {
      return res.status(409).json({ error: 'User already exists with this email' });
    }

    const user = await createUser(value);
    const token = generateToken(user.id);

    res.status(201).json({ user, token });
  } catch (error) {
    next(error);
  }
});

// Login
router.post('/login', async (req, res, next) => {
  try {
    const { error, value } = loginSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const user = await getUserByEmail(value.email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const isValidPassword = await validatePassword(value.password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const { password, ...userWithoutPassword } = user;
    const token = generateToken(user.id);

    res.json({ user: userWithoutPassword, token });
  } catch (error) {
    next(error);
  }
});

// Get profile
router.get('/profile', authenticateToken, async (req, res) => {
  res.json(req.user);
});

// Update profile
router.put('/profile', authenticateToken, async (req, res, next) => {
  try {
    const { error, value } = profileUpdateSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const updatedUser = await updateUser(req.user.id, value);
    res.json(updatedUser);
  } catch (error) {
    next(error);
  }
});

export default router;
