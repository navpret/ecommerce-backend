const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
    try {
        const token = req.header("Authorization")
        if (!token) return res.status(400).json({ message: "Invalid Authentication" })
    
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
            if (err) return res.status(400).json({ message: "Invalid Authentiacation" })

            req.user = user
            console.log(user)
            next()
        })
    } catch (error) {
        return res.status(500).json({message: error.message})
    }
}

module.exports = auth