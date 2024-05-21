const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const { Sequelize } = require('sequelize');

// Load environment variables from .env file
dotenv.config();

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Database setup
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: 'postgres'
});

// Test database connection
sequelize.authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

// Import models
const User = require('./models/User')(sequelize, Sequelize);
const Exercise = require('./models/Exercise')(sequelize, Sequelize);
const Goal = require('./models/Goal')(sequelize, Sequelize);

// Define relationships
User.hasMany(Exercise, { foreignKey: 'userId' });
User.hasMany(Goal, { foreignKey: 'userId' });
Exercise.belongsTo(User, { foreignKey: 'userId' });
Goal.belongsTo(User, { foreignKey: 'userId' });

// Sync database
sequelize.sync({ force: true }).then(() => {
  console.log('Database & tables created!');
});

// Import routes
const userRoutes = require('./routes/user');
const exerciseRoutes = require('./routes/exercise');
const goalRoutes = require('./routes/goal');

// Use routes
app.use('/api/users', userRoutes);
app.use('/api/exercises', exerciseRoutes);
app.use('/api/goals', goalRoutes);

// Set port
const PORT = process.env.PORT || 3000;

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
