const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const quizRoutes = require('./routes/quizRoutes');
const db = require('./config/db');  // MySQL connection setup
const { verifyToken } = require('./middlewares/middlewares'); // Import verifyToken from middlewares.js

const app = express();


// JWT secret key (Make sure this is defined at the top)
const SECRET_KEY = "4545"; 

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Serve static files for the frontend
app.use(express.static('public'));


// Serve the login or register page first
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/register.html'); // Serve the register page by default
});

// Register a new user
app.post('/api/register', async (req, res) => {
    const { username, password, role } = req.body;

    // Check if an admin already exists if the selected role is "admin"
    if (role === 'admin') {
        db.query('SELECT * FROM Users WHERE role = "admin"', (err, results) => {
            if (err) throw err;
            if (results.length > 0) {
                return res.json({ success: false, message: "Admin already exists. Only one admin is allowed." });
            }

            // Proceed to register the admin
            registerUser(username, password, role, res);
        });
    } else {
        // Proceed to register a regular user
        registerUser(username, password, role, res);
    }
});

function registerUser(username, password, role, res) {
    // Check if username exists
    db.query('SELECT * FROM Users WHERE username = ?', [username], async (err, results) => {
        if (err) throw err;
        if (results.length > 0) {
            return res.json({ success: false, message: "Username already exists" });
        }

        // Hash password and save user
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

// Redirect to the quiz page after login
app.get('/quiz', verifyToken, (req, res) => {
    res.sendFile(__dirname + '/public/quiz.html');
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

    // Ensure the user is authenticated
    if (!req.user) {
        return res.status(403).send("Access denied. No token provided.");
    }

    // Insert user results into the database
    db.query('INSERT INTO Results (user_id, score, total_questions, date_taken) VALUES (?, ?, ?, NOW())',
        [req.user.id, score, total_questions], (err, result) => {
            if (err) {
                console.error("Error submitting results:", err);
                return res.status(500).json({ success: false, message: "Error submitting results" });
            }
            res.json({ success: true, message: "Results submitted successfully" });
        });
});


// Admin route to view all user results (protected and restricted to admins)
app.get('/api/admin/results', verifyToken, (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ success: false, message: "Access denied" });
    }

    // Fetch results from the database
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
