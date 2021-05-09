const Products = require('../models/productModel')
const Orders = require('../models/orderModel')

const orderCtrl = {
    placeOrder: async (req, res) => {
        try {
            const {cart} = req.body

            const newOrder = new Orders({
                user_id: req.user.id,
                cart
            })

            res.json(await newOrder.save())
        } catch (error) {
            res.status(500).json({ messgae: error.message })
        }
        
    },
    getOrders: async (req, res) => {
        try {
            const orders = await Orders.find({})

            res.json(orders)
        } catch (error) {
            res.status(500).json({ messgae: error.message })
        }
        
    }
}

module.exports = orderCtrl