// Import required modules
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');

// Create an Express application
const app = express();

// Middleware setup
app.use(bodyParser.json());
app.use(cors());

// Import routes
const userRoutes = require('./routes/user');
const exerciseRoutes = require('./routes/exercise');
const weatherRoutes = require('./routes/weather');

// Use routes
app.use('/api/users', userRoutes);
app.use('/api/exercises', exerciseRoutes);
app.use('/api/weather', weatherRoutes);

// Database connection
const dbURI = 'your-mongodb-connection-string-here';
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected...'))
    .catch(err => console.log(err));

// Define the port the app will run on
const port = process.env.PORT || 5000;

// Start the server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

module.exports = app;
