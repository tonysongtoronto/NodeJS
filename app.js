const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const app = express();

const sequelize = require('./util/database');

const errorsController = require('./controllers/errors.js');
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

const Product = require('./models/product');
const User = require('./models/user');
const Cart = require('./models/cart');
const CartItem = require('./models/cart-item');
const Order = require('./models/order');
const OrderItem = require('./models/order-item');



app.set('view engine', 'ejs');

app.set('views', 'views');

app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
    User.findByPk(1)
        .then(user => {
            req.user = user;
            next();
        })
        .catch(err => console.log(err));
})


app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorsController.get404);

Product.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });
User.hasMany(Product);

User.hasOne(Cart);
Cart.belongsTo(User);


Product.belongsToMany(Cart, { through: CartItem });
Cart.belongsToMany(Product, { through: CartItem });

Order.belongsTo(User);
User.hasMany(Order);
Order.belongsToMany(Product, { through: OrderItem });
Product.belongsToMany(Order, { through: OrderItem });




sequelize
  //  .sync({force:true})
     .sync()
    .then(result => {
     
         return User.findByPk(1);
    })
    .then(user => {
     
     if(user) {
            return user;
        }
        return User.create({ name: 'tony', email: 'tony@example.com' });
    })
    .then( user=>{

        user.createCart()
    
    }
  ).then( cart=>{
    app.listen(3000);

  }

  )
    .catch(err => {
        if(err) console.log(err);
    });
