const Product = require('../models/product');




module.exports.getProducts = (req, res, next) => {

      Product
        .fetchAll()
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
        .fetchAll()
        .then(products => {
            res.render('shop/index', {
                pageTitle: 'Shop',
                path: '/',
                products: products
            });
        })
        .catch(err => console.log(err));


};

module.exports.getCart = (req, res, next) => {
   
       req.user
        .getCart()
        .then(products => {

   

            res.render('shop/cart', {
                pageTitle: 'Cart',
                path: '/cart',
                products: products
            });
        })
        .catch(err => console.log(err));
  
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
    req.user.deleteFromCart(productId)    
        .then(result => {
            res.redirect('/cart');
        })
        .catch(err => console.log(err));
};



module.exports.getOrders = (req, res, next) => {
    req.user.
        getOrders({
            include: ['products']
        })
        .then(orders => {
            res.render('shop/orders', {
                pageTitle: 'Orders',
                path: '/orders',
                orders: orders
            });
        })
        .catch(err => console.log(err));
};

module.exports.getCheckout = (req, res, next) => {
    res.render('shop/checkout', {
        pageTitle: 'Checkout',
        path: '/checkout'
    });
};


module.exports.postOrder = (req, res, next) => {
    let fetchedCart;
    req.user
        .addOrder()
       
        .then(result => {
            res.redirect('/orders');
        })
        .catch(err => console.log(err));
};