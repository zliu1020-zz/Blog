var express = require('express');
var router = express.Router();
var authMiddleware = require('../middleware/authentication-middleware');

/**
 * POST /signout
 */
router.get('/', authMiddleware.authenticateUIRequests, function(req, res, next) {
    req.session.user = null;
    req.flash('success', 'Signing out succeeded');
    res.redirect('/signin');
});


module.exports = router;
