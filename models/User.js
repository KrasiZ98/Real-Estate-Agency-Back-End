const { Schema, model } = require('mongoose');

const NAME_PATTERN = /^[A-Z][a-z]+\s[A-Z][a-z]+$/gm;

const userSchema = new Schema({
    fullName: {type: String, require: true, unique: true, validate: {
        validator: (value) => NAME_PATTERN.test(value),
        message: 'The name should be following by specific format',
    }},
    username: {type: String, unique: true, minlength: [5, 'The username should be at least 5 characters long']},
    hashedPassword: {type: String, required: true,  minlength: [4, 'The password should be at least 4 characters long']},
});

userSchema.index({fullName: 1}, {
    collation: {
        locale: 'en',
        strength: 2,
    },
});

userSchema.index({username: 1}, {
    collation: {
        locale: 'en',
        strength: 2,
    },
});


const User = model('User', userSchema);
module.exports = User;
// • The name should be in the following format -> (firstname lastname) - "Alexandur Petrov" 
// • The username should be at least 5 characters long
// • The password should be at least 4 characters long
// • The repeat password should be equal to the password