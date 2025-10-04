const fs = require('fs');
const path = require('path');

const cartDataDir = path.join(
  path.dirname(process.mainModule.filename),
  'data',
  'cart.json'
);

const getCartFromFile = (callback) => {
  fs.readFile(cartDataDir, (err, fileContent) => {
    if (err) {
      // 文件不存在时，返回默认空购物车
      callback({ products: [], totalPrice: 0 });
      return;
    }

    try {
      const content = fileContent.toString().trim();

      if (!content) {
        // 文件为空的情况
        callback({ products: [], totalPrice: 0 });
      } else {
        // 正常解析
        callback(JSON.parse(content));
      }
    } catch (e) {
      console.error("Invalid cart.json, resetting:", e);
      callback({ products: [], totalPrice: 0 });
    }
  });
};

module.exports = class Cart {


  static addProduct(id, productPrice) {
    // Fetch the previous cart
    fs.readFile(cartDataDir, (err, fileContent) => {
      let cart = { products: [], totalPrice: 0 };

      if (err || fileContent.length === 0) {
        cart = { products: [], totalPrice: 0 };
      } else {
        try {
          cart = JSON.parse(fileContent);
        } catch (e) {
          // 如果 JSON 格式不对，也重置
          console.error("Invalid cart.json, resetting:", e);
          cart = { products: [], totalPrice: 0 };
        }
      }
      // Analyze the cart => Find existing product
      const existingProductIndex = cart.products.findIndex(
        prod => prod.id === id
      );
      const existingProduct = cart.products[existingProductIndex];
      let updatedProduct;
      // Add new product/ increase quantity
      if (existingProduct) {
        updatedProduct = { ...existingProduct };
        updatedProduct.qty = updatedProduct.qty + 1;
        cart.products = [...cart.products];
        cart.products[existingProductIndex] = updatedProduct;
      } else {
        updatedProduct = { id: id, qty: 1 };
        cart.products = [...cart.products, updatedProduct];
      }
      cart.totalPrice = cart.totalPrice + +productPrice;
      fs.writeFile(cartDataDir, JSON.stringify(cart), err => {
        console.log(err);
      });
    });
  }


  static removeProduct(productId, productPrice, callback) {
    getCartFromFile(cart => {
      if (cart.products.length > 0) {
        let updatedProducts = [];
        let count = 0;
        for (let product of cart.products) {
          if (product.id === productId) {
            count = product.quantity;
            continue;
          }
          updatedProducts.push(product);
        }
        cart.products = updatedProducts;
        cart.totalPrice -= productPrice * count;
        fs.writeFile(cartDataDir, JSON.stringify(cart), err => {
          callback(err);
        });
      }
    });
  }

  static fetchAll(callback) {
    getCartFromFile(cart => {
      callback(cart);
    });
  }





};
