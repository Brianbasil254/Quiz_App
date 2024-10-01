const jwt = require('jsonwebtoken');
const SECRET_KEY = "4545"; // Ensure this matches your app's secret

// Middleware for verifying token
function verifyToken(req, res, next) {
    const token = req.headers['authorization'];
    if (!token) return res.status(403).send("Access denied");

    try {
        const decoded = jwt.verify(token.split(' ')[1], SECRET_KEY); // Extract the token
        req.user = decoded;
        next();
    } catch (err) {
        res.status(400).send("Invalid token");
    }
}

module.exports = { verifyToken };
