const { Schema, model, Types } = require('mongoose');

const URL_PATTERN = /^https?:\/\/.+$/i;

const postSchema = new Schema({
    name: { type: String, required: true, unique: true, minlength: [6, 'The Name should be at least 6 characters'] },
    type: { type: String, required: true, },
    year: { type: Number, required: true, min: [1850, 'The Year should be between 1850 and 2021'], max: [2021, 'The Year should be between 1850 and 2021'] },
    city: { type: String, required: true, minlength: [4, 'The City should be at least 4 characters'] },
    homeImage: {
        type: String, required: true, validate: {
            validator: (value) => URL_PATTERN.test(value),
            message: 'The Home Image should starts with http:// or https://.',
        }
    },
    description: { type: String, required: true, maxlength: [60, 'The Property Description should be a maximum of 60 characters long.'] },
    pieces: { type: Number, required: true, min: [0, 'The Available Pieces should be positive number (from 0 to 10)'], max: [10, 'The Available Pieces should be positive number (from 0 to 10)'] },
    rentedHouse: { type: [Types.ObjectId], ref: 'User', default: [] },
    owner: { type: Types.ObjectId, required: true, ref: 'User' },
    users: {type: Array, required: true, default: []},
});

postSchema.index({name: 1}, {
    collation: {
        locale: 'en',
        strength: 2,
    }
});

const Post = model('Post', postSchema);

module.exports = Post;

// • The Name should be at least 6 characters
// • The Year should be between 1850 and 2021
// • The City should be at least 4 characters long
// • The Home Image should starts with http:// or https://.
// • The Property Description should be a maximum of 60 characters long.
// • The Available Pieces should be positive number (from 0 to 10)