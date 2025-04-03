async function userUnauthorized(req, res, next) {
    try {
        const token = req.headers.id
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

        function isValidUUID(uuid) {
            return uuidRegex.test(uuid);
        }

        console.log(isValidUUID(token));
        if (isValidUUID(token) === false) {
            return res.status(400).json({message:"The id is Invalid"})
        }
        if (!token) {
            return res.status(401).json({ message: "You are unauthorized" })
        }
        next()
    } catch (error) {
        return res.status(500).json({ error: "internal server error" })
    }
}

module.exports = userUnauthorized;