const jwt = require("jsonwebtoken")

async function generateToken(user) {
    try {
        console.log("user ", user)
        console.log("user type ", typeof user)
        const payload = {
            id: user?.id,
            name: user?.name
        }
        // HS256 // ek hi key se 
        // RS256
        const token = jwt.sign(payload, "ndjsdnjsndjs", { expiresIn: '1y' },)
        console.log("generate token ", token)
        return token

    } catch (error) {
        console.error("jwt error: ", error)
    }
}

module.exports = { generateToken }