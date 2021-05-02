const Products = require('../models/productModel')

//  Filter, sorting and pagination
class APIfeatures {
    constructor(query, queryString) {
        this.query = query
        this.queryString = queryString
    }

    filtering() {
        const queryObj = { ...this.queryString } // this.queyString = req.query
        console.log("-----\n", queryObj)

        const excludedFields = ['page', 'sort', 'limit']
        excludedFields.forEach(el => delete(queryObj[el]))
        
        console.log(queryObj)

        let queryStr = JSON.stringify(queryObj)
        queryStr = queryStr.replace(/\b(gte|gt|lt|lte|regex)\b/g, match => '$' + match)
        console.log({ queryObj, queryStr }, '------\n') 
        
        this.query.find(JSON.parse(queryStr))

        return this

    }

    sorting() {
        if (this.queryString.sort) {
            const sortBy = this.queryString.sort.split(',').join(' ')
            console.log(sortBy)
            this.query = this.query.sort(sortBy)
        } else {
            this.query.sort('-createdAt')
        }
        return this
    }

    pagination() {
        const page = this.queryString.page * 1 || 1
        const limit = this.queryString.limit * 1 || 3
        const skip = (page - 1) * limit
        this.query = this.query.skip(skip).limit(limit)

        return this
    }
}

const productCtrl = {  
    getProducts: async (req, res) =>  {
        try {
            const features = new APIfeatures(Products.find(), req.query)
                .filtering()
                .sorting()
                .pagination()
            const products = await features.query

            res.json({
                status: "success", 
                result: products.length,
                products
            })
        } catch (error) {
            return res.status(500).json({ message: error.message })
        }
    },
    createProducts: async (req, res) =>  {
        try {
            const { product_id, title, price,
                description, content, images,
                category 
            } = req.body

            if (!images) return res.status(400).json({ message: "No image Uplaoded" })

            const product = await Products.findOne({ product_id })
            if (product)
                return res.status(400).json({ mesasge: "Product alredy exists" })

            const newProduct = new Products({
                product_id, title, price, description, content, images, category
            })
            
            await newProduct.save()
            res.status(201).json({ message: "Created new Product" })
        } catch (error) {
            return res.status(500).json({ message: error.message })
        }
    },
    deleteProducts: async (req, res) =>  {
        try {
            await Products.findByIdAndDelete(req.params.id)
            res.json({ message: "Deleted the product" })
        } catch (error) {
            return res.status(500).json({ message: error.message })
        }
    },
    updateProducts: async (req, res) =>  {
        try {
            const { title, price,
                description, content, images,
                category 
            } = req.body

            if (!images) return res.status(400).json({ message: "No image iploaded" })
        
            await Products.findOneAndUpdate({_id: req.params.id}, {
                title, price,
                description, content, images,
                category 
            })

            res.json({ message: "Updated the Product" })
        } catch (error) {
            return res.status(500).json({ message: error.message })
        }
    }
}

module.exports = productCtrl