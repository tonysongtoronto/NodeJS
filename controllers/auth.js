 //const cookies = require('../util/cookie');
const User = require('../models/user');

module.exports.getLogin = (req, res, next) => {
    res.render('auth/login', {
        pageTitle: 'Login',
        path: '/login',
        isAuthenticated: false
    });
};

module.exports.postLogin = (req, res, next) => {
   //  res.setHeader('Set-Cookie', 'loggedIn=true; Max-Age=10; httpOnly');
   //  res.setHeader('Set-Cookie', 'loggedIn=true; Max-Age:10; Secure');
    User
        .findById('68e88dad80bff537da9d0c6a')
        .then(user => {
            req.session.user = user;
            req.session.isLoggedIn = true;
            req.session.save(err => {
                if(err) console.log(err);
                res.redirect('/');
            });
        })
        .catch(err => console.log(err));
};

module.exports.postLogout = (req, res, next) => {
    req.session.destroy(err => {
        if(err) console.log(err);
        res.redirect('/');
    });
}
