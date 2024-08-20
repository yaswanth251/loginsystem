// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

app.use(cors({
  origin: "http://localhost:3000"
}));
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/user_db')
  .then(() => console.log('Mongodb connected'))
  .catch(err => console.error('Mongodb connection error:', err));

const UserSchema = new mongoose.Schema({
  username: String,
  mobile: String,
  password: String
});

const User = mongoose.model('User', UserSchema);

app.post('/register', async (req, res) => {
  try {
    const { username, mobile, password } = req.body;
    console.log(username,mobile)
    const user = new User({ username, mobile, password });
    await user.save();
    res.send('User registered successfully');
  } catch (error) {
    res.status(500).send('Error registering user');
  }
});

app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    console.log(username, password);
    const user = await User.findOne({ username, password });
    if (user) {
      res.json({ message: true });
    } else {
      res.status(401).send('Invalid credentials');
    }
  } catch (error) {
    res.status(500).send('Error logging in');
  }
});

app.listen(5000, () => {
  console.log('Server running on port 5000');
});
