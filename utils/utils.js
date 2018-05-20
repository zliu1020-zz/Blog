function validateSignUpParameters(username, password, confirmPassword, gender, avatar, bio){
    if(username.length < 1 || username.length > 10){
        throw new Error('Invalid username length - Expect to be within the range of 1 to 10');
    }
    if(password.length <= 5){
        throw new Error('Password is too weak - Expect to be at least 6 characters long');
    }
    if(password !== confirmPassword){
        throw new Error('Password and confirmed password mismatched');
    }
    if(!['x','m', 'f'].includes(gender)){
        throw new Error('Unrecognized gender value');
    }
    if(!avatar.hasOwnProperty('name')){
        throw new Error('No avatar provided');
    }

    if(bio.length < 1){
        throw new Error('About Me cannot be empty');
    }
}

function validateSignInParameters(username, password){
    if(!username || !password){
        throw new Error('Please enter username and password');
    }
}

function validateArticleCreation(title, content){
    if(!title || title.length === 0 || !content || content.length === 0){
        throw new Error('Please specify article title and content');
    }
}

module.exports = {
    validateSignUpParameters: validateSignUpParameters,
    validateSignInParameters: validateSignInParameters,
    validateArticleCreation: validateArticleCreation
}