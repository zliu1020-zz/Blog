var Article = require('../lib/mongo').Article;
var marked = require('marked');

Article.plugin('contentToHtml', {
    afterFind: function (articles) {
        return articles.map( (article) => {
            article.content = marked(article.content);
            return article;
        })
    },
    afterFindOne: function (article) {
        if (article) {
            article.content = marked(article.content);
        }
        return article;
    }
});

module.exports = {
    create: function(article){
        return Article.create(article).exec();
    },
    getArticleById: function(id){
        return Article
            .findOne({_id: id})
            .populate({path: 'author', model: 'User'})
            .addCreatedAt()
            .contentToHtml();
    },
    getArticles: function(author){
        let query = {};
        if(author){
            query.author = author;
        }
        return Article
            .find(query)
            .populate({ path: 'author', model: 'User' })
            .sort({ _id: -1 })
            .addCreatedAt()
            .contentToHtml()
            .exec();
    },
    increaseView: function(id){
        return Article.update({_id: id}, {$inc: { view: 1 }}).exec();
    }

};