const { getAllPost } = require('../services/postServices');

const homeController = require('express').Router();

homeController.get('/', async (req, res) => {
    const post = await getAllPost();

    res.render('home', {
        title: 'Home Page',
        post,
    });
});

homeController.get('/catalog', async (req, res) => {
    const post = await getAllPost();

    res.render('home', {
        title: 'Home Page',
        post,
    });
});

module.exports = homeController