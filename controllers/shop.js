const Order = require('../models/order');
const Product = require('../models/product');




module.exports.getProducts = (req, res, next) => {

       Product
             .find()
        .then(products => {
             res.render('shop/product-list', {
                  pageTitle: 'All Products',
                 path: '/products',
                products: products
            });
        })
        .catch(err => console.log(err));

};

module.exports.getProduct = (req, res, next) => {

    const productId = req.params.productId;
    Product.findById(productId)
    .then((prod) => {  
         const product = prod;   
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
           .find()
        .then(products => {
            res.render('shop/index', {
                pageTitle: 'Shop',
                path: '/',
                products: products
            });
        })
        .catch(err => console.log(err));


};

module.exports.getCart = async (req, res, next) => {


    try {
        await req.user.populate('cart.items.productId');
        
        let products = [...req.user.cart.items].map(product => {
            return { ...product.productId._doc, quantity: product.quantity };
        });
        
        res.render('shop/cart', {
            pageTitle: 'Cart',
            path: '/cart',
            products: products
        });
    }
     catch(err) {
        console.log(err);
       
    }
};




module.exports.postCart = (req, res, next) => {
    const productId = req.body.productId;
  
    req.user.addToCart(productId)
        .then(result => {
            res.redirect('/');
        })
        .catch(err => console.log(err));
};



module.exports.postDeleteCartProduct = (req, res, next) => {

  const productId = req.body.productId;
    req.user.deleteItemFromCart(productId)    
        .then(result => {
            res.redirect('/cart');
        })
        .catch(err => console.log(err));
};



module.exports.getOrders = (req, res, next) => {
    Order
        .find({ 'user._id': req.user._id })
        .sort({ _id: -1 })
        .then(orders => {
            res.render('shop/orders', {
                pageTitle: 'Orders',
                path: '/orders',
                orders: orders
            });
        })
        .catch(err => {
            console.log(err);
            next(err);
        });
};

module.exports.getCheckout = (req, res, next) => {
    res.render('shop/checkout', {
        pageTitle: 'Checkout',
        path: '/checkout'
    });
};


module.exports.postOrder = async (req, res, next) => {
    try {
        await req.user.populate('cart.items.productId');
        
        let orderproducts = [...req.user.cart.items].map(product => {
            return { ...product.productId._doc, quantity: product.quantity };
        });
     
        const order = new Order({
            user: {
                _id: req.user._id,
                username: req.user.username
            },
            products: orderproducts
        });
        
        await order.save();
        await req.user.clearCart();
        
        res.redirect('/orders');
        
    } catch(err) {
        console.log(err);
        next(err);
    }
};