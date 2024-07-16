const Product = require("../models/product");
const mongoose = require('mongoose');

exports.getAllProducts = async (req, res, next) => {
    try {
        const products = await Product.find();
        res.json({ products });
    } catch(err) {
        res.status(500).json({ message: err.message });
    }
}

exports.postProduct = async (req, res, next) => {
    const { name, price } = req.body;

    if (!name || !price) {
        return res.status(400).json({ message: 'Name and price are required' });
    }

    try {
        const newProduct = new Product({
            name,
            price
        });

        const savedProduct = await newProduct.save();
        res.json({ message: 'Product created successfully', product: savedProduct });
        
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}