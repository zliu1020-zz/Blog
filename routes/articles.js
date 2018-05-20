var express = require('express');
var router = express.Router();
var authMiddleware = require('../middleware/authentication-middleware');
var ArticleModel = require('../models/articles');
var utils = require('../utils/utils');
/**
 *  GET /articles/new
 *  Retrieve the article creation page
 */
router.get('/new', authMiddleware.authenticateUIRequests, function(req, res, next) {
    res.render('newArticle');
});

/**
 *  GET /articles/{articleID}/edit
 *  Retrieve the article edit page
 */
router.get('/:articleId/edit', authMiddleware.authenticateUIRequests, function(req, res, next) {
    res.send('Edit article page');
});

/**
 *  GET /articles/{articleID}
 *  Retrieve an article by id
 */
router.get('/:articleId', authMiddleware.authenticateUIRequests, function(req, res, next) {
    const id = req.params.articleId;

    Promise.all([
        ArticleModel.getArticleById(id),
        ArticleModel.increaseView(id)
    ])
        .then(function (result) {
            const article = result[0];
            if (!article) {
                throw new Error('No such article exists')
            }

            res.render('article', {
                article: article
            })
        })
        .catch((e) => {
            next(e);
        });
});

/**
 *  GET /articles?author={userId}
 *  Retrieve all articles
 */
router.get('/', authMiddleware.authenticateUIRequests, function(req, res, next) {

    const author = req.query.author;

    ArticleModel.getArticles(author)
        .then((articles) => {
            res.render('articles', {
                articles: articles
            })
        })
        .catch((e) => {
            next(e);
        });
});


/**
 *  POST /articles/new
 *  Create a new article
 */
router.post('/new', authMiddleware.authenticateUIRequests, function(req, res, next) {
    let author = req.session.user._id;
    let title = req.fields.title;
    let content = req.fields.content;

    try{
        utils.validateArticleCreation(title, content);
    }catch(e){
        req.flash('error', e.message);
        return res.redirect('back');
    }

    let article = {
        'author': author,
        'title': title,
        'content': content,
        'view': 0
    }

    ArticleModel.create(article)
        .then((response) => {
            article = response.ops[0];
            req.flash('success', 'Congrats! Publishing the article succeeded.');
            res.redirect(`/articles/${article._id}`);
        })
        .catch((e) => {
            next(e);
        });

});

/**
 *  PUT /articles/{articleID}/edit
 *  Edit an article
 */
router.put('/:articleId/edit', authMiddleware.authenticateUIRequests, function(req, res, next) {
    res.send('Edited and Updated an article');
});


/**
 *  DELETE /articles/{articleID}/delete
 *  Delete an article by id
 */
router.delete('/:articleId/delete', authMiddleware.authenticateUIRequests, function(req, res, next) {
    res.send('deleted an article by id');
});

module.exports = router;
