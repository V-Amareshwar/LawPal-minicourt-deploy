const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const mongoose = require('mongoose');

module.exports = (authenticateToken, checkDatabaseConnection) => {

    // Login
    router.post('/login', async (req, res) => {
        try {
            const { email, password } = req.body;
            const user = await User.findOne({ email });
            if (!user) return res.status(400).json({ error: 'User not found' });

            const isMatch = await user.comparePassword(password);
            if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

            const token = jwt.sign({ id: user._id.toString(), email: user.email }, process.env.JWT_SECRET);
            res.json({
                token,
                user: { id: user._id, email: user.email, displayName: user.displayName }
            });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    });

    // Register
    router.post('/register', async (req, res) => {
        try {
            const { email, password, displayName } = req.body;
            if (!email || !password) return res.status(400).json({ error: 'Email and password required' });

            const existing = await User.findOne({ email });
            if (existing) return res.status(400).json({ error: 'Email already registered' });

            const user = new User({
                email,
                password,
                displayName: displayName || email.split('@')[0]
            });

            await user.save();
            const token = jwt.sign({ id: user._id.toString(), email: user.email }, process.env.JWT_SECRET);
            res.status(201).json({ token, user: { id: user._id, email: user.email, displayName: user.displayName } });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    });

    // Get Profile
    router.get('/profile', authenticateToken, checkDatabaseConnection, async (req, res) => {
        try {
            const user = await User.findById(req.user.id).select('-password');
            if (!user) return res.status(404).json({ error: 'User not found' });

            res.json(user);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    });

    // Update Profile
    router.patch('/profile', authenticateToken, checkDatabaseConnection, async (req, res) => {
        try {
            const { displayName, avatarUrl, email } = req.body;
            const user = await User.findById(req.user.id);
            if (!user) return res.status(404).json({ error: 'User not found' });

            if (email && email !== user.email) {
                const existing = await User.findOne({ email });
                if (existing) return res.status(400).json({ error: 'Email already registered' });
                user.email = email;
            }

            if (displayName) user.displayName = displayName;
            if (avatarUrl) user.avatarUrl = avatarUrl;
            await user.save();

            res.json({ message: 'Profile updated', user });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    });

    // Change Password
    router.patch('/change-password', authenticateToken, checkDatabaseConnection, async (req, res) => {
        try {
            const { currentPassword, newPassword } = req.body;
            if (!currentPassword || !newPassword) {
                return res.status(400).json({ error: 'Current and new passwords are required' });
            }

            const user = await User.findById(req.user.id);
            if (!user) return res.status(404).json({ error: 'User not found' });

            const isMatch = await user.comparePassword(currentPassword);
            if (!isMatch) return res.status(400).json({ error: 'Current password is incorrect' });

            if (newPassword.length < 6) {
                return res.status(400).json({ error: 'Password must be at least 6 characters' });
            }

            user.password = newPassword;
            await user.save();

            res.json({ message: 'Password changed successfully' });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    });

    // Forgot Password (Email + New Password)
    router.post('/forgot-password', async (req, res) => {
        try {
            const { email, newPassword } = req.body;
            if (!email || !newPassword) {
                return res.status(400).json({ error: 'Email and new password are required' });
            }
            if (newPassword.length < 6) {
                return res.status(400).json({ error: 'Password must be at least 6 characters' });
            }

            const user = await User.findOne({ email });
            if (!user) return res.status(404).json({ error: 'User not found' });

            user.password = newPassword;
            await user.save();

            res.json({ message: 'Password reset successfully' });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    });

    return router;
};
