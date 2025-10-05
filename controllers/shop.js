const Product = require('../models/product');
const Cart = require('../models/cart');



module.exports.getProducts = (req, res, next) => {
    Product
        .fetchAll()
        .then(([rows, fieldData]) => {
            res.render('shop/product-list', {
                  pageTitle: 'All Products',
                 path: '/products',
                products: rows
            });
        })
        .catch(err => {
            if(err) console.log(err);
        });
};

module.exports.getProduct = (req, res, next) => {
    const productId = req.params.productId;
    Product.fetch(productId)
    .then(([rows]) => {

           const product = rows[0];
            res.render('shop/product-details', {
                   pageTitle: product.title,
                   path: '/products',
                product: product
            });
        })
        .catch(err => {
            if(err) console.log(err);
        });
};



module.exports.getIndex = (req, res, next) => {
    Product
        .fetchAll()
        .then(([rows, fieldData]) => {
            res.render('shop/index', {
                pageTitle: 'Shop',
                path: '/',
                products: rows
            });
        })
        .catch(err => {
            if(err) console.log(err);
        });
};

module.exports.getCart = (req, res, next) => {
    Cart.fetchAll(
        cart => {
        Product.fetchAll()
        .then(([rows, fieldData]) =>
             {
              const products=rows;           
              const newProducts = [];
            for(let product of products) {
                let cartProductData = cart.products.find(prod => prod.id === product.id.toString());
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

             }

        ).catch(err => {
            if(err) console.log(err);
        });
            

    });
};





exports.postCart = (req, res, next) => {
    const prodId = req.body.productId;

    Product.fetch(prodId)
        .then(([rows]) => {
            const product = rows[0];
            Cart.addProduct(prodId, product.price);
            res.redirect('/cart');
        })
        .catch(err => {
            console.log(err);
        });
};




module.exports.postDeleteCartProduct = (req, res, next) => {
    Product.fetch(req.body.productId)
        .then(([rows]) => {
            const product = rows[0];

            Cart.removeProduct(product.id.toString(), product.price, err => {
                if (!err) {
                    res.redirect('/cart');
                } else {
                    console.log(err);
                }
            });
        })
        .catch(err => {
            console.log(err);
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