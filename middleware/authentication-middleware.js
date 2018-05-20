function authenticateUIRequests(req, res, next){
    if(!req.session.user){
        req.flash('error', 'Not Logged In');
        return res.redirect('/signin');
    }
    next();
}

function authenticateLoginRequests(req, res, next){
    if(req.session.user){
        req.flash('error', 'Already Logged In');
        return res.redirect('back');
    }
    next();
}

module.exports = {
    authenticateUIRequests: authenticateUIRequests,
    authenticateLoginRequests: authenticateLoginRequests
}