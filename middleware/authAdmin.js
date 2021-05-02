const Users = require('../models/userModel')

const authAdmin = async (req, res, next) => {
    try {
        // Get user info by id
        const user= await Users.findById( req.user.id )

        if (user.role === 0 )
            return res.status(400).json({ message: "Admin access denied" })
        
        next()

    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}
module.exports = authAdmin