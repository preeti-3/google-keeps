const jwt = require("jsonwebtoken")
async function authenticateToken(req, res, next) {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) return res.status(401).json({ error: 'Access denied. No token provided.' });
        const decoded = jwt.verify(token, 'ndjsdnjsndjs');
        console.log(decoded, "token")
        req.user = decoded
        next()
    } catch (error) {
        console.log("token error: ", error)
        return res.status(500).json({ error: "internal server error" })
    }
}

module.exports = authenticateToken;