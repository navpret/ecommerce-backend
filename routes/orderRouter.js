const router = require('express').Router()
const orderCtrl = require('../controllers/orderCtrl')
const auth = require('../middleware/auth')
const authAdmin = require('../middleware/authAdmin')

router.route('/order')
    .get(auth, authAdmin, orderCtrl.getOrders)
    .post(auth, orderCtrl.placeOrder)


module.exports = router