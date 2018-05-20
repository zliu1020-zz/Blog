var express = require('express');
var router = express.Router();
var sha1 = require('sha1');

var authMiddleware = require('../middleware/authentication-middleware');
var UserModel = require('../models/users');
var utils = require('../utils/utils');
/** GET /signin
 *  Retrieve the sign in page
 */
router.get('/', authMiddleware.authenticateLoginRequests, function(req, res, next) {
    res.render('signin');
});

/** Post /signin
 *  Post sign in request
 */
router.post('/', authMiddleware.authenticateLoginRequests, function(req, res, next) {
    let username = req.fields.username;
    let password = req.fields.password;

    try{
        utils.validateSignInParameters(username, password);
    }catch(e){
        req.flash('error', e.message);
        return res.redirect('back');
    }

    UserModel.getUserByName(username)
        .then((user) => {
            if(!user){
                req.flash('error', 'No such user exists');
                return res.redirect('back');
            }
            if(sha1(password) !== user.password){
                req.flash('error', 'Wrong username or password');
                return res.redirect('back');
            }

            req.flash('success', 'Logged in successfully!');
            delete user.password;
            req.session.user = user;

            res.redirect('/articles');
        })
        .catch((e) => {
            next(e);
        });
});

module.exports = router;
