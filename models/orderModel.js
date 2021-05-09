const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    user_id: {
        type: String,
        required: true
    },
    cart: {
        type: Array,
        default: []
    }
}, {
    timestamps: true
})

module.exports = mongoose.model("Orders", OrderSchema)