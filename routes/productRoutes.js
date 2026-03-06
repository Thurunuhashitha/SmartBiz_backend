const express = require('express');
const router = express.Router();
const {product} = require('../controller/productController');
 
router.post('/product', product); 


module.exports = router;