const Product = require('../models/product');

module.exports.postAddProduct = (req, res, next) => {


    const product = new Product(
        req.body.title,
        req.body.imageUrl,
        req.body.description,
        req.body.price
    );
    product.save();
    res.redirect('/');
};

module.exports.getAddProduct = (req, res, next) => {
    res.render('admin/add-product', {
        pageTitle:'Add Product',
        path: '/admin/add-product'
    });
};


module.exports.getEditProduct = (req, res, next) => {
    // fetch the specific product details
    const product = {}
    res.render('admin/edit-product', {
        pageTitle: '',
        path: '/admin/edit-product',
        product: product
    });
};

module.exports.postEditProduct = (req, res, next) => {};

module.exports.getProducts = (req, res, next) => {
    Product.fetchAll((products) => {
        res.render('admin/product-list', {
            pageTitle: '',
            path: '/admin/products',
            products: products
        });
    });
};