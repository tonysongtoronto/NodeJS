const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();

const envKeys = require('./keys');

const errorsController = require('./controllers/errors.js');
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

// Models
const User = require('./models/user');

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));

 app.use((req, res, next) => {
        User.findById('68e88dad80bff537da9d0c6a')     
        .then(user => {        
            if(user && !req.user) {
                req.user = user;
            }
            next();
        })
        .catch(err => console.log(err));
});
app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorsController.get404);


mongoose
    .connect(envKeys.MONGODB_URI, {

  dbName: 'myshop'
})
.then(result => {
        return User.findOne();
    })
    .then(user => {
        if(!user) {
            user = new User({
                username: 'tony',
                email: 'tony@example.com',
                cart: {

                    items: []
                }
            });
        }

        return user.save();
    })
    .then(result => {
        app.listen(envKeys.PORT);
    })
    .catch(err => console.log(err));
