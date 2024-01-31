const User = require("../models/User");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const SECREET_TOKEN = 'kamakUIkaklaa';

async function register(fullName, username, password) {
    const existing = await User.findOne({ username }).collation({ locale: 'en', strength: 2 });
    
    if(existing) {
        throw new Error('Username is taken');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
        fullName,
        username,
        hashedPassword,
    });

    const token = createSession(user);
    return token;
}

async function login(username, password) {
    const user = await User.findOne({ username }).collation({ locale: 'en', strength: 2 });

    if(!user) {
        throw new Error('Incorect username or password');
    }

    const hasMatch = await bcrypt.compare(password, user.hashedPassword);

    if(hasMatch == false) {
        throw new Error('Incorect username or password');
    }

    const token = createSession(user);
    return token;
}

function createSession({_id, fullName, username, }) {
    const payload = {
        _id,
        fullName,
        username,
    };

    return jwt.sign(payload, SECREET_TOKEN);
}

function verifyToken(token) {
    return jwt.verify(token, SECREET_TOKEN);
}

module.exports = {
    register,
    login,
    verifyToken,
}