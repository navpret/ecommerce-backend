const Users = require('../models/userModel')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config()

const SALT_ROUNDS = 10

const userCtrl = {
    register: async (req, res) => {
        try {
            const { name, email, password } = req.body

            const user = await Users.findOne({email})
            if (user) return res.status(400).json({ message: "Email Already Exists" })

            if (password.length < 6)
                return res.status(400).json({ message: "Password must be 6 characters long." })

            // Password Encryption
            const passwordHash = await bcrypt.hash(password, SALT_ROUNDS)
            // Create New User
            const newUser = new Users({
                name, email, password: passwordHash
            })
            await newUser.save()

            // Create JWT
            const accesstoken = createAccessToken({ id: newUser._id })
            const refreshtoken = createRefreshToken({ id: newUser._id })

            res.cookie('refreshtoken', refreshtoken, {
                httpOnly: true,
                path: '/user/refresh_token'
            })

            // Send Success Message
            res.status(201).json(accesstoken)

        } catch (error) {
            return res.status(500).json({ message: error.message })
        }
    },
    login: async (req, res) => {
        try {
            const { email, password } = req.body

            const user = await Users.findOne({ email })
            if (!user) return res.status(400).json({ message: "User does not exist" })

            const isMatch  = await bcrypt.compare(password, user.password)
            if (!isMatch) return res.status(400).json({ message: "Incorrect Password" })

            // If login is successful, create access & refresh token
            const accessToken = createAccessToken({ id: user._id })
            const refreshToken = createRefreshToken({ id: user._id })

            res.cookie('refreshtoken', refreshToken, {
                httpOnly: true,
                path: '/user/refresh_token'
            })

            res.json({ accessToken })

        } catch (error) {
            return res.status(500).json({ message: error.message })
        }
    },
    logout: (req, res) => {
        try {
            res.clearCookie('refreshToken', {path: '/user/refresh_token'})
            return res.json({ message: "Logged Out" })
        } catch (error) {
            return res.status(500).json({ message: error.message })
        }
    },
    refreshToken: (req, res) => {

        try {
            const rf_token = req.cookies.refreshtoken
            if (!rf_token) return res.status(400).json({ message: "Please Login Or Register" })
        
            jwt.verify(rf_token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
                if (err) return res.status(400).json({message: "Please login or register"})
                
                const accesstoken = createAccessToken({id: user.id})
                
                res.json({ user, accesstoken })
            })

            // res.json({ rf_token })
            
        } catch (error) {
            return res.status(500).json({ message: error.message })
        }
    },
    getUser: async (req, res) => {
        try {
            const user = await Users.findById(req.user.id).select('-password')
            if (!user) return res.status(400).json({ message: "User does not exist." })

            res.json(user) 
        } catch (error) {
            return res.status(500).json({ message: error.message })
        }
    }
}

// Access token Function
const createAccessToken = user => {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1d' })
}
const createRefreshToken = user => {
    return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' })
}

module.exports = userCtrl