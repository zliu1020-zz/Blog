var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var flash = require('connect-flash');
var config = require('./config/config');
var pkg = require('./package');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public')));

// session middleware setup
app.use(session({
    name: config.session.key,
    secret: config.session.secret,
    resave: true,
    saveUninitialized: false,
    cookie: {
        maxAge: config.session.maxAge
    },
    store: new MongoStore({
        url: config.mongodb
    })
}));

// flash middlware setup
app.use(flash());

// handle form/file uploading
app.use(require('express-formidable')({
    uploadDir: path.join(__dirname, 'public/img'),
    keepExtensions: true
}));

// 设置模板全局常量
app.locals.blog = {
    title: pkg.name,
    description: pkg.description
}

// 添加模板必需的三个变量
app.use(function (req, res, next) {
    res.locals.user = req.session.user;
    res.locals.success = req.flash('success').toString();
    res.locals.error = req.flash('error').toString();
    next();
})

// routes setup
app.get('/', function (req, res) {
    res.redirect('/articles')
});
app.use('/signup', require('./routes/signup'));
app.use('/signin', require('./routes/signin'));
app.use('/signout', require('./routes/signout'));
app.use('/articles', require('./routes/articles'));
app.use('/comments', require('./routes/comments'));

app.listen(config.port, function () {
    console.log(`${pkg.name} listening on port ${config.port}`);
});


module.exports = app;
