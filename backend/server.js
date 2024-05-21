const express = require('express');
const bodyParser = require('body-parser');
const { Sequelize, DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Database setup
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: 'postgres'
});

// Models
const User = sequelize.define('User', {
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  }
});

const Exercise = sequelize.define('Exercise', {
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false
  },
  duration: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  caloriesBurned: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false
  }
});

const Goal = sequelize.define('Goal', {
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false
  },
  target: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  achieved: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
});

// Relationships
User.hasMany(Exercise, { foreignKey: 'userId' });
User.hasMany(Goal, { foreignKey: 'userId' });
Exercise.belongsTo(User, { foreignKey: 'userId' });
Goal.belongsTo(User, { foreignKey: 'userId' });

// Sync database
sequelize.sync({ force: true }).then(() => {
  console.log('Database & tables created!');
});

// Routes
app.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ username, email, password: hashedPassword });
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(401).json({ error: 'Invalid password' });

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post('/exercise', async (req, res) => {
  try {
    const { userId, type, duration, caloriesBurned, date } = req.body;
    const exercise = await Exercise.create({ userId, type, duration, caloriesBurned, date });
    res.status(201).json(exercise);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post('/goal', async (req, res) => {
  try {
    const { userId, type, target } = req.body;
    const goal = await Goal.create({ userId, type, target });
    res.status(201).json(goal);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get('/exercises/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const exercises = await Exercise.findAll({ where: { userId } });
    res.json(exercises);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get('/goals/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const goals = await Goal.findAll({ where: { userId } });
    res.json(goals);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
