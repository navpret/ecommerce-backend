const Categories = require('../models/categoryModel')

const categoryCtrl = {
    getCategories: async (req, res ) => {
        try {
            const categories = await Categories.find()

            res.json(categories)
        } catch (error) {
            
            return res.status(500).json({ message: error.message })
        }
    },
    createCategory: async (req, res) => {
        try {

            const { name } = req.body
            const category = await Categories.findOne({ name })
            if (category) return res.status(400).json({ message: "This category already exists" })

            const newCategory = new Categories({ name })

            await newCategory.save()
            res.json({ message: "Created a category" })

        } catch (error) {
            
            return res.status(500).json({ message: error.message })
        }
    },
    deleteCategory: async (req, res) => {
        try {
            await Categories.findByIdAndDelete(req.params.id)
            res.json({ message: "Deleted the category" })
        } catch (error) {
            res.status(500).json({ message: error.message })
        }
    },
    updateCategory: async (req, res) => {
        try {
            const { name } = req.body; 
            await Categories.findOneAndUpdate({ _id: req.params.id }, { name })

            res.json({ message: "Updated the category" })
        } catch (error) {
            res.status(500).json({ message: error.message })
        }
    }
}

module.exports = categoryCtrl