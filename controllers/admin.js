const Product = require('../models/product');

module.exports.postAddProduct = (req, res, next) => {

      const productTitle = req.body.title;
    const productPrice = req.body.price;
    const productImageUrl = req.body.imageUrl;
    const productDescription = req.body.description;
   const userId = req.user.id;

      req.user
        .createProduct({
            title: productTitle,
            price: productPrice,
            imageUrl: productImageUrl,
            description: productDescription
        })
        .then(result => {
            res.redirect('/admin/products');
        })
        .catch(err => console.log(err));

};

module.exports.getAddProduct = (req, res, next) => {
    res.render('admin/edit-product', {
        pageTitle:'Add Product',
        path: '/admin/add-product',
        editing: false
    });
};


module.exports.getEditProduct = (req, res, next) => {
    // Fetch the specific product details
    const editMode = req.query.edit;
    if (!editMode) {
        return res.redirect('/');
    }

    const productId = req.params.productId;
     req.user.getProducts(   {
             where: {
                id: productId
             }
         }).then((products) => {
            const product = products[0];
            if (!product) {
                return res.redirect('/');
            }
            res.render('admin/edit-product', {
                pageTitle: 'Edit Product',
                path: '/products',
                editing: editMode,
                product: product
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


        Product
        .findByPk(productId)
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
   req.user.getProducts()
        .then((products) => {
            res.render('admin/product-list', {
                  pageTitle: '',
                 path: '/admin/products',
                products: products
            });
        })
        .catch(err => {
            if(err) console.log(err);
        });
};



module.exports.postDeleteProduct = (req, res, next) => {
 

      const productId = req.body.productId;
    Product
        .destroy({
            where: {
                id: productId
            }
        })
        .then(result => {
            res.redirect('/admin/products');
        })
        .catch(err => console.log(err));
};