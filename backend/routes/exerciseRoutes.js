const express = require('express');
const Exercise = require('../models/Exercise');
const auth = require('../middleware/authMiddleware');

const router = express.Router();

// Add Exercise
router.post('/add', auth, async (req, res) => {
    const { name, duration, calories } = req.body;
    try {
        const exercise = new Exercise({ user: req.user.id, name, duration, calories });
        await exercise.save();
        res.status(201).json({ message: 'Exercise logged successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
