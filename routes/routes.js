const express = require('express');
const router = express.Router();
const authToken = require('../middlewares/authToken');
const userController = require("../controllers/user");
const productController = require("../controllers/product");

router.post('/register', userController.register);
router.post('/login', userController.login);
router.post("/", authToken.authToken, productController.postProduct );
router.get("/", authToken.authToken, productController.getAllProducts);


module.exports = router;