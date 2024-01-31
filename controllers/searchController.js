const { hasUser } = require('../middlewears/guards');
const { searchingByType } = require('../services/postServices');

const searchControllers = require('express').Router();

searchControllers.get('/search', hasUser(), (req, res) => {
    res.render('search', {
        title: 'Search page',
    });
});

searchControllers.post('/search', hasUser(), async (req, res) => {
    const result = await searchingByType(req.body.search);
    
    res.render('search', {
        title: 'Search page',
        result,
    });
});


module.exports = searchControllers;