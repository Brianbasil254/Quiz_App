const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const quizRoutes = require('./routes/quizRoutes');
const db = require('./config/db');  // MySQL connection setup
const { verifyToken } = require('./middlewares/middlewares'); // Import verifyToken from middlewares.js

const app = express();

// JWT secret key
const SECRET_KEY = "4545"; 

// Middleware
app.use(bodyParser.json());
app.use(cors());
app.use(express.static('public')); // Serve static files for the frontend

// Serve the index as the landing page
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html'); 
});

// Register a new user
app.post('/api/register', async (req, res) => {
    const { username, password, role } = req.body;

    // Check if admin already exists if registering as admin
    if (role === 'admin') {
        db.query('SELECT * FROM Users WHERE role = "admin"', (err, results) => {
            if (err) throw err;
            if (results.length > 0) {
                return res.json({ success: false, message: "Admin already exists. Only one admin is allowed." });
            }
            // Register admin
            registerUser(username, password, role, res);
        });
    } else {
        // Register regular user
        registerUser(username, password, role, res);
    }
});

// Helper function to register users
function registerUser(username, password, role, res) {
    db.query('SELECT * FROM Users WHERE username = ?', [username], async (err, results) => {
        if (err) throw err;
        if (results.length > 0) {
            return res.json({ success: false, message: "Username already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        db.query('INSERT INTO Users (username, password, role) VALUES (?, ?, ?)', [username, hashedPassword, role], (err, result) => {
            if (err) throw err;
            res.json({ success: true, message: "User registered" });
        });
    });
}

// Login route
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;

    db.query('SELECT * FROM Users WHERE username = ?', [username], async (err, results) => {
        if (err) throw err;
        if (results.length === 0) {
            return res.json({ success: false, message: "User not found" });
        }

        const user = results[0];
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.json({ success: false, message: "Invalid password" });
        }

        // Generate JWT token
        const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, SECRET_KEY, { expiresIn: '1h' });
        res.json({ success: true, token });
    });
});

// Redirect to quiz page after login
app.get('/quiz', verifyToken, (req, res) => {
    res.sendFile(__dirname + '/public/quiz.html');
});

// Admin route to add new questions (restricted to admins)
app.get('/admin/add-questions', verifyToken, (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ success: false, message: "Access denied" });
    }
    res.sendFile(__dirname + '/public/add_questions.html');
});

// Fetch quiz questions (protected route)
app.get('/api/questions', verifyToken, (req, res) => {
    db.query('SELECT * FROM QuizQuestions', (err, result) => {
        if (err) throw err;
        res.json(result);
    });
});

// Submit quiz results (protected route)
app.post('/api/results', verifyToken, (req, res) => {
    const { score, total_questions } = req.body;

    if (!req.user) {
        return res.status(403).send("Access denied. No token provided.");
    }

    db.query('INSERT INTO Results (user_id, score, total_questions, date_taken) VALUES (?, ?, ?, NOW())',
        [req.user.id, score, total_questions], (err, result) => {
            if (err) {
                console.error("Error submitting results:", err);
                return res.status(500).json({ success: false, message: "Error submitting results" });
            }
            res.json({ success: true, message: "Results submitted successfully" });
        });
});

// Admin route to view all user results (restricted to admins)
app.get('/api/admin/results', verifyToken, (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ success: false, message: "Access denied" });
    }

    db.query('SELECT Users.username, Results.score, Results.total_questions, Results.date_taken, Results.id FROM Results JOIN Users ON Results.user_id = Users.id', 
        (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

// Use quiz routes
app.use('/api', quizRoutes);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
