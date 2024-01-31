const Post = require("../models/Post");
const User = require("../models/User");
const { find } = require("../models/User");

async function getAllPost() {
    return Post.find({}).lean();
}

async function getPostById(id) {
    return await Post.findById(id).lean();
}

async function create(post) {
    await Post.create(post);
}

async function update(id, post) {
    const result = await Post.findById(id);

    result.name = post.name;
    result.type = post.type;
    result.year = post.year;
    result.city = post.city;
    result.homeImage = post.homeImage;
    result.description = post.description;
    result.pieces = post.pieces;

    await result.save();
}

async function deleteById(id) {
    await Post.findByIdAndDelete(id);
}

async function searchingByType(search) {
    return await Post.find({ type: search }).lean();
}

async function rentHouse(postId, userId) {
    const post = await Post.findById(postId);
    const user = await User.findById(userId);

    if (post.rentedHouse.includes(userId)) {
        throw new Error('Cannot rent house twice');
    }

    post.rentedHouse.push(userId);
    post.users.push(user.username).split(', ');
    await post.save();
}

module.exports = {
    getAllPost,
    getPostById,
    create,
    update,
    deleteById,
    searchingByType,
    rentHouse,
}