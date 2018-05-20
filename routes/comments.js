var express = require('express');
var router = express.Router();
var authMiddleware = require('../middleware/authentication-middleware');

/** POST /comments
 *  Create a new comment
 */
router.post('/', authMiddleware.authenticateUIRequests, function(req, res, next) {
    res.send('Create a new comment');
});

/** DELETE /comments/{commentId}
 *  Delete a comment by id
 */
router.delete('/', authMiddleware.authenticateUIRequests, function(req, res, next) {
    res.send('Delete a comment by id');
});

module.exports = router;
