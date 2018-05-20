var config = require('../config/config');
var Mongolass = require('mongolass');
var mongolass = new Mongolass();
mongolass.connect(config.mongodb);

var moment = require('moment');
var objectIdToTimestamp = require('objectid-to-timestamp');

exports.User = mongolass.model('User', {
    name: {
        type: 'string',
        required: true
    },
    password: {
        type: 'string',
        required: true
    },
    avatar: {
        type: 'string',
        required: true
    },
    gender: {
        type: 'string',
        enum: ['m', 'f', 'x'],
        default: 'x'
    },
    bio: {
        type: 'string',
        required: true
    }
});

// retrieve users by user name, user name is unique per user
exports.User.index({name: 1}, {unique: true}).exec();

exports.Article = mongolass.model('Article', {
    author: {
        type: Mongolass.Types.ObjectId,
        required: true
    },
    title: {
        type: 'string',
        required: true
    },
    content: {
        type: 'string',
        required: true
    },
    view: {
        type: 'number',
        required: true
    }
});

// Retrieve articles in a descending order of time
exports.Article.index({ author: 1, _id: -1 }).exec();

mongolass.plugin('addCreatedAt', {
    afterFind: function (results) {
        results.forEach((item) => {
            item.created_at = moment(objectIdToTimestamp(item._id)).format('YYYY-MM-DD HH:mm')
        });
        return results;
    },
    afterFindOne: function (result) {
        if (result) {
            result.created_at = moment(objectIdToTimestamp(result._id)).format('YYYY-MM-DD HH:mm')
        }
        return result;
    }
})