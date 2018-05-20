var User = require('../lib/mongo').User;

module.exports = {
    //create a new user
    create: function (user) {
        return User.create(user).exec();
    },

    getUserByName: function (username) {
        return User.findOne({name: username}).addCreatedAt().exec();

    }
};