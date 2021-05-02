const router = require('express').Router()
const cloudinary = require('cloudinary');
const auth = require('../middleware/auth')
const authAdmin = require('../middleware/authAdmin')
const fs = require('fs');

//  Uplaoding images to cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key : process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})

// Upload images
router.post('/upload',auth , authAdmin, (req, res) => {
    try {
        console.log(req.files)
        if (!req.files || Object.keys(req.files).length === 0)
            return res.status(400).json({message: "No files were uploaded"})

        const file = req.files.file;
        if (file.size > 1024*1024) {// If file size id > 1mb
            removeTmp(file.tempFilePath)
            return res.status(400).json({ message: "Size > 1mb" })
        }

        if (!(['image/jpg', 'image/png', 'image/jpeg'].includes(file.mimetype))) {
            removeTmp(file.tempFilePath)
            return res.status(400).json({ message: "File format is incorrect" })
        }
        cloudinary.v2.uploader.upload(file.tempFilePath, {
            folder: 'ecommerce'
        }, async (err, result) => {
            if (err) throw err

            removeTmp(file.tempFilePath)

            res.json({ public_id: result.public_id, url: result.secure_url })
        })

    } catch (error) {
        res.status(500).json({ message: error })
    }
})

// Delete image
router.delete('/destroy', auth , authAdmin, (req, res) => {
    try {
        const {public_id} = req.body
        if (!public_id) return res.status(400).json({ message: 'Cannot find selected image' })

        cloudinary.v2.uploader.destroy(public_id, async (err, result) => {
            if (err) throw err

            res.json({ msg: "Image Deleted" })
        })
        
    } catch (error) {
        res.status(500).json({ message: error })
    }
})

const removeTmp = (path) => {
    fs.unlink(path, err => {
        if (err) throw err
    })
}

module.exports = router 