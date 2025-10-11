const Product = require('../models/product');



module.exports.getAddProduct = (req, res, next) => {
    res.render('admin/edit-product', {
        pageTitle:'Add Product',
        path: '/admin/add-product',
        editing: false
    });
};


module.exports.postAddProduct = (req, res, next) => {
    const productTitle = req.body.title;
    const productPrice = req.body.price;
    const productImageUrl = req.body.imageUrl;
    const productDescription = req.body.description;


      const userId = req.user._id;

    const product = new Product({
        title: productTitle,
        price: productPrice,
        imageUrl: productImageUrl,
        description: productDescription,
        userId: userId
    });
    
    
    product
        .save()
        .then(result => {
            res.redirect('/admin/products');
        })
        .catch(err => console.log(err));
};


module.exports.getEditProduct = (req, res, next) => {
    // Fetch the specific product details
    const editMode = req.query.edit;
    if (!editMode) {
        return res.redirect('/');
    }

    const productId = req.params.productId;
    Product.findById(productId).then((prod) => {

            if (!prod) {
                return res.redirect('/');
            }
            res.render('admin/edit-product', {
                pageTitle: 'Edit Product',
                path: '/products',
                editing: editMode,
                product: prod
            });
        })
        .catch(err => {
            console.log(err);
        });
};


module.exports.postEditProduct = (req, res, next) => {
  

    const productId = req.body.id;
    const productTitle = req.body.title;
    const productPrice = req.body.price;
    const productImageUrl = req.body.imageUrl;
    const productDescription = req.body.description;
    // const productUserId = req.body.userId;

  Product
        .findById(productId)
        .then(product => {
            product.title = productTitle;
            product.price = productPrice;
            product.imageUrl = productImageUrl;
            product.description = productDescription;
            return product.save();
        })
        .then(result => {
            res.redirect('/admin/products');
        })
        .catch(err => console.log(err));
  
};


module.exports.getProducts = (req, res, next) => {

    Product
        .find()
        .then(products => {
            res.render('admin/product-list', {
                pageTitle: 'All Products',
                path: '/admin/products',
                products: products
            });
        })
        .catch(err => console.log(err));
};


module.exports.postDeleteProduct = (req, res, next) => {
    const productId = req.body.productId;
        Product
        // .findByIdAndRemove(productId) // deprecated without setting 'useFindAndModify: false'
        .findByIdAndDelete(productId)
        .then(result => {
            res.redirect('/admin/products');
        })
        .catch(err => console.log(err));
};
