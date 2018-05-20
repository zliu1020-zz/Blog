var express = require('express');
var router = express.Router();
var fs = require('fs');
var sha1 = require('sha1');
var path = require('path');

var UserModel = require('../models/users');
var authMiddleware = require('../middleware/authentication-middleware');
var utils = require('../utils/utils');

/** GET /signup
 *  Retrieve the sign up page
 */
router.get('/', authMiddleware.authenticateLoginRequests, function(req, res, next) {
    res.render('signup'); //render signup.ejs
});

/** POST /signup
 *  Post sign up request
 */
router.post('/', authMiddleware.authenticateLoginRequests, function(req, res, next) {

    /*** Fetch request parameters and validate them ***/
    let username = req.fields.username;
    let password = req.fields.password;
    let confirmPassword = req.fields.confirmPassword;
    let gender = req.fields.gender;
    let bio = req.fields.bio;
    let avatar = req.files.avatar;

    try{
        utils.validateSignUpParameters(username, password, confirmPassword, gender, avatar, bio);
    }catch(e){
        /*** Redirect to sign up page if any validation failed ***/
        fs.unlink(avatar.path); // delete the avatar
        req.flash('error', e.message);
        return res.redirect('/signup');
    }

    // parameter massaging
    avatar = req.files.avatar.path.split(path.sep).pop();
    password = sha1(password);

    /*** Store the user into database ***/
    let user = {
        name: username,
        password: password,
        avatar: avatar,
        gender: gender,
        bio: bio
    }

    UserModel.create(user)
        .then((response) => {
            user = response.ops[0];
            delete user.password; //delete sensitive data
            req.session.user = user;
            req.flash('success', 'Congrats! Signing up succeeded.');
            return res.redirect('/articles');
        })
        .catch((e) => {
            fs.unlink(req.files.avatar.path)

            //handle the case where username already exists
            if (e.message.match('duplicate key')) {
                req.flash('error', 'Username already exists')
                return res.redirect('/signup');
            }
            next(e);
        });

});
module.exports = router;
