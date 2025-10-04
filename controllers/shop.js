const Product = require('../models/product');
const Cart = require('../models/cart');

module.exports.getProducts = (req, res, next) => {
    Product.fetchAll((products) => {
        res.render('shop/product-list', {
            pageTitle: 'All Products',
            path: '/products',
            products: products
        });
    });
};

module.exports.getProduct = (req, res, next) => {
    const productId = req.params.productId;
    Product.fetch(productId, product => {
        res.render('shop/product-details', {
            pageTitle: product.title,
            path: '/products',
            product: product
        });
    });
};

module.exports.getIndex = (req, res, next) => {
    Product.fetchAll((products) => {
        res.render('shop/index', {
            pageTitle: 'Shop',
            path: '/',
            products: products
        });
    });
};

module.exports.getCart = (req, res, next) => {
    Cart.fetchAll(cart => {
        Product.fetchAll(products => {
            const newProducts = [];
            for(let product of products) {
                let cartProductData = cart.products.find(prod => prod.id === product.id);
                if(cartProductData) {
                    newProducts.push({...product, quantity: cartProductData.qty});
                }
            }
            const newCart = {
                products: newProducts,
                totalPrice: cart.totalPrice
            };

            res.render('shop/cart', {
                pageTitle: 'Your Cart',
                path: '/cart',
                cart: newCart
            });
        });
    });
};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  Product.fetch(prodId, product => {
  Cart.addProduct(prodId, product.price);
  });
  res.redirect('/cart');
};

module.exports.postDeleteCartProduct = (req, res, next) => {
    Product.fetch(req.body.productId, product => {
        Cart.removeProduct(product.id, product.price, err => {
            if(!err) {
                res.redirect('/cart');
            }
        });
    });
};


module.exports.getOrders = (req, res, next) => {
    res.render('shop/orders', {
        pageTitle: 'Your Orders',
        path: '/orders'
    });
};

module.exports.getCheckout = (req, res, next) => {
    res.render('shop/checkout', {
        pageTitle: 'Checkout',
        path: '/checkout'
    });
};