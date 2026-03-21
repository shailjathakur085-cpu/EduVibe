import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
// Register mein JWT ki zaroorat nahi hoti usually, par agar import hai toh rehne do

export const registerUser = async (req, res) => {
  try {
    console.log("Incoming Data:", req.body); 

    const { name, email, password } = req.body;

    // 1. Validation
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Please fill all fields" });
    }

    // 2. Duplicate User Check
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // 3. Password Hash karna
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 4. DIRECT CREATE (No .save() needed)
    // Dhyan dein: Hum 'User' model use kar rahe hain, 'newUser' variable nahi.
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: 'student' // Default role
    });

    // Success Response
    if (user) {
      res.status(201).json({
        message: 'User registered successfully',
        _id: user.id,
        name: user.name,
        email: user.email
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }

  } catch (error) {
    console.error("Error in Register:", error);
    res.status(500).json({ error: error.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    console.log("Login Request:", req.body); // Debugging ke liye data print karega

    const { email, password } = req.body;

    // 1. Validation: Check karo fields bhari hain ya nahi
    if (!email || !password) {
      return res.status(400).json({ message: "Please provide email and password" });
    }

    // 2. User dhoondo Database mein
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // 3. Password Compare karo (Jo user ne dala vs Jo DB mein hashed hai)
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // 4. Token Generate karo
    // Note: Agar .env file nahi bani toh 'mysecretkey' use karega (Testing ke liye)
    const token = jwt.sign(
      { id: user._id, role: user.role }, 
      process.env.JWT_SECRET || 'mysecretkey', 
      { expiresIn: '1d' } 
    );

    // 5. Success Response bhejo
    res.status(200).json({
      message: 'Login successful',
      token, 
      user: {
        id: user._id,
        role: user.role
      }
    });

  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ error: error.message });
  }
};