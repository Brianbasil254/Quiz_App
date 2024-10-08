const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { verifyToken } = require('../middlewares/middlewares'); // Correct import statement

// Get all questions
router.get('/questions', verifyToken, (req, res) => {
    let sql = 'SELECT * FROM Quizquestions';
    db.query(sql, (err, result) => {
        if (err) throw err;

        console.log("Fetched questions from database:", result); // Add a debug log

        // Format the result by combining option_a, option_b, option_c, option_d into an Options array
        const formattedQuestions = result.map(question => ({
            id: question.id,
            question: question.question,
            Options: [question.option_a, question.option_b, question.option_c, question.option_d],  // Combine options
            answer: question.answer,
            explanation: question.explanation
        }));

        // Send the formatted questions to the frontend
        res.json(formattedQuestions);
    });
});

console.log("verifyToken:", verifyToken); // Log the verifyToken to ensure it's defined

// Add a new question (protected route)
router.post('/questions', verifyToken, (req, res) => {
    // Ensure the user is an admin
    if (req.user.role !== 'admin') {
        return res.status(403).json({ success: false, message: "Access denied" });
    }

    const { question, option_a, option_b, option_c, option_d, answer, explanation } = req.body;

    // Insert the new question into the database
    const sql = 'INSERT INTO QuizQuestions (question, option_a, option_b, option_c, option_d, answer, explanation) VALUES (?, ?, ?, ?, ?, ?, ?)';
    const values = [question, option_a, option_b, option_c, option_d, answer, explanation];

    db.query(sql, values, (err, result) => {
        if (err) {
            return res.status(500).json({ success: false, message: "Error adding question" });
        }
        res.json({ success: true, message: "Question added successfully" });
    });
});

// Delete a specific user result by ID (admin-only)
router.delete('/admin/results/:id', verifyToken, (req, res) => {
    const { id } = req.params;

    // Check if the user is an admin
    if (req.user.role !== 'admin') {
        return res.status(403).json({ success: false, message: "Access denied" });
    }

    const sql = 'DELETE FROM Results WHERE id = ?';
    db.query(sql, [id], (err, result) => {
        if (err) {
            return res.status(500).json({ success: false, message: "Error deleting result" });
        }
        res.json({ success: true, message: "Result deleted successfully" });
    });
});



module.exports = router;
