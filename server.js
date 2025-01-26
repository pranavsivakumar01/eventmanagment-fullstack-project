import express from 'express';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';

dotenv.config();

const app = express();

app.use(cors());
app.use(bodyParser.json());

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Define user schema and model
const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, enum: ['student', 'staff', 'admin'], default: 'student' },
});

const User = mongoose.model('User', userSchema);

// Define event schema and model
const eventSchema = new mongoose.Schema({
  name: String,
  date: Date,
  description: String,
  status: { type: String, default: 'Pending Approval' },
});

const Event = mongoose.model('Event', eventSchema);

// Define enrollment schema and model
const enrollmentSchema = new mongoose.Schema({
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event' },
  name: String,
  email: String,
  comments: String,
  date: { type: Date, default: Date.now },
});

const Enrollment = mongoose.model('Enrollment', enrollmentSchema);

// User registration route
app.post('/api/auth/register', async (req, res) => {
  const { firstName, lastName, email, password, role } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new User({ firstName, lastName, email, password: hashedPassword, role });

    await newUser.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
});

// User login route
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    res.status(200).json({ message: 'Login successful', role: user.role });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.post('/forgot-password', async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: "pranavas.22aim@kongu.edu",
        pass: "pranavsivakumar@1234",
      },
    });

    const mailOptions = {
      from: "pranavas.22aim@kongu.edu",
      to: user.email,
      subject: 'Password Reset',
      html: `<p>Click <a href="http://localhost:5000/reset-password/${token}">here</a> to reset your password</p>`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return res.status(500).json({ message: 'Error sending reset link' });
      }
      res.json({ message: 'Check your email for the reset link!' });
    });

  } catch (error) {
    res.status(500).json({ message: 'Error sending reset link' });
  }
});


app.get('/reset-password/:token', (req, res) => {
  const token = req.params.token;

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(400).send('Invalid or expired token');

   res.send(`
  <style>
    body {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100vh;
      margin: 0;
      background-color: #f0f2f5;
      font-family: Arial, sans-serif;
    }
    .reset-container {
      background-color: #ffffff;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      width: 300px;
      text-align: center;
    }
    h1 {
      font-size: 24px;
      color: #333333;
      margin-bottom: 20px;
    }
    input[type="password"] {
      width: 100%;
      padding: 10px;
      margin: 10px 0;
      border: 1px solid #ccc;
      border-radius: 4px;
    }
    button {
      width: 100%;
      padding: 10px;
      background-color: #007bff;
      color: #ffffff;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 16px;
    }
    button:hover {
      background-color: #0056b3;
    }
  </style>
  <div class="reset-container">
    <h1>Reset Password</h1>
    <form action="/reset-password" method="POST">
      <input type="hidden" name="token" value="${token}" />
      <input type="password" name="newPassword" placeholder="Enter new password" required />
      <button type="submit">Reset Password</button>
    </form>
  </div>
`);

  });
});
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.post('/reset-password', async (req, res) => {
  const { token, newPassword } = req.body;
  console.log(token)

  jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
    if (err) return res.status(400).send('Invalid or expired token');
    const userId = decoded.id;

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    try {
      const user = await User.findByIdAndUpdate(userId, { password: hashedPassword });
      if (!user) return res.status(400).send('User not found');

      res.send('Password successfully updated');
    } catch (error) {
      res.status(500).send('Error updating password');
    }
  });
});

// Enrollment route
app.post('/api/enroll', async (req, res) => {
  const { eventId, name, email, comments } = req.body;
  try {
    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    const newEnrollment = new Enrollment({ eventId, name, email, comments });
    await newEnrollment.save();

    res.status(201).json({ message: 'Enrollment successful' });
  } catch (error) {
    console.error('Enrollment error:', error);
    res.status(500).json({ message: 'Server error during enrollment' });
  }
});

// Get all events route
app.get('/api/events', async (req, res) => {
  try {
    const events = await Event.find();
    res.json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ message: 'Error fetching events' });
  }
});

// Create new event route
app.post('/api/events', async (req, res) => {
  try {
    const newEvent = new Event(req.body);
    await newEvent.save();
    res.status(201).json(newEvent);
  } catch (error) {
    console.error('Error saving event:', error);
    res.status(500).json({ message: 'Error saving event' });
  }
});

// Update event route
app.patch('/api/events/:id', async (req, res) => {
  const eventId = req.params.id;
  try {
    const updatedEvent = await Event.findByIdAndUpdate(eventId, req.body, { new: true });
    if (!updatedEvent) return res.status(404).json({ message: 'Event not found' });

    res.json(updatedEvent);
  } catch (error) {
    console.error('Error updating event:', error);
    res.status(500).json({ message: 'Error updating event' });
  }
});

// Get all enrollments route
app.get('/api/enrollments', async (req, res) => {
  try {
    const enrollments = await Enrollment.find().populate('eventId');
    res.json(enrollments);
  } catch (error) {
    console.error('Error fetching enrollments:', error);
    res.status(500).json({ message: 'Error fetching enrollments' });
  }
});

// Get registrations for specific event
app.get('/api/events/:eventId/registrations', async (req, res) => {
  try {
    const registrations = await Enrollment.find({ eventId: req.params.eventId });
    res.json(registrations);
  } catch (error) {
    console.error('Error fetching registrations:', error);
    res.status(500).json({ message: 'Error fetching registrations' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 
