require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const fileUpload = require('express-fileupload')

const app = express()

const PORT = process.env.PORT || 4020
const MONGO_URL = process.env.MONGO_URL

app.use(express.json())
app.use(cookieParser())
app.use(cors())
app.use(fileUpload({
    useTempFiles: true
})) 

// Connection
mongoose.connect(MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: true, 
}, err => {
    if (err) throw err;
    console.log('Connected to MongoDB')
})

// Default Route
app.get('/', (req, res) => {
    res.json({ message: "Welcome to ShopinGo's Backend server. To access content, send GET requests to domains with auth header" })
})

// Routes
app.use('/user', require('./routes/userRouter'))
app.use('/api', require('./routes/categoryRouter'))
app.use('/api', require('./routes/uploadRouter'))
app.use('/api', require('./routes/productRouter'))
app.use('/api', require('./routes/orderRouter'))

// Start at PORT
app.listen(PORT, () => {
    console.info(`Server is running on PORT ${PORT}`)
})