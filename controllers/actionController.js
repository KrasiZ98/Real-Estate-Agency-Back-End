const { hasUser } = require('../middlewears/guards');
const Post = require('../models/Post');
const User = require('../models/User');
const { create, getAllPost, getPostById, update, deleteById, rentHouse } = require('../services/postServices');
const { parserErrors } = require('../util/parser');

const actionContrroller = require('express').Router();

actionContrroller.get('/create', hasUser(), (req, res) => {
    res.render('create', {
        title: 'Create page',
    });
});

actionContrroller.post('/create', hasUser(), async (req, res) => {
    console.log(req.body);
    console.log(Object.values(req.body).map(v => !v))
    const createPost = {
        name: req.body.name,
        type: req.body.type,
        year: Number(req.body.year),
        city: req.body.city,
        homeImage: req.body.homeImage,
        description: req.body.description,
        pieces: Number(req.body.pieces),
        owner: req.user._id,
    };
    try {
        if (req.body.name == '' || req.body.type == '' || req.body.year == '' || req.body.city == '' || req.body.homeImage == '' || req.body.description == '' || req.body.pieces == '') {
            throw new Error('All fields are required');
        }

        await create(createPost);
        res.redirect('/catalog')
    } catch (error) {
        console.error(error);
        res.render('create', {
            title: 'Create page',
            errors: parserErrors(error),
            body: createPost,
        });
    }
});

actionContrroller.get('/:id/details', async (req, res) => {
    const post = await getPostById(req.params.id);
    post.leftPieces = post.pieces - post.rentedHouse.length;
    let hbsTemplate = '';
   console.log(post)
    //post.leftPieces = post.pieces -= post.rentedHouse.length;
    
    if (req.user) {
        hbsTemplate = 'details';
        post.isOwner = post.owner.toString() == req.user._id;
        if (post.rentedHouse.toString().includes(req.user._id)) {
            post.isRented = true;
        }

    } else {
        hbsTemplate = 'guestDetails';
    }

    if (post.leftPieces == 0) {
        post.noPieces = true;
    }

    console.log(post);
    res.render(hbsTemplate, {
        title: 'Details page',
        post,
    });
});

actionContrroller.get('/:id/edit', hasUser(), async (req, res) => {
    const post = await getPostById(req.params.id);

    if (post.owner.toString() !== req.user._id) {
        return res.redirect('/auth/login');
    }

    res.render('edit', {
        title: 'Edit page',
        post,
    });
});

actionContrroller.post('/:id/edit', hasUser(), async (req, res) => {
    const post = await getPostById(req.params.id);

    const edited = {
        name: req.body.name,
        type: req.body.type,
        year: req.body.year,
        city: req.body.city,
        homeImage: req.body.homeImage,
        description: req.body.description,
        pieces: req.body.pieces,
    };
    if (post.owner.toString() !== req.user._id) {
        return res.redirect('/auth/login');
    }
    try {
        if (req.body.name == '' || req.body.type == '' || req.body.year == '' || req.body.city == '' || req.body.homeImage == '' || req.body.description == '' || req.body.pieces == '') {
            throw new Error('All fields are required');
        }

        await update(req.params.id, edited);
        res.redirect(`/action/${req.params.id}/details`);

    } catch (error) {
        console.error(error);
        res.render('edit', {
            title: 'Edit page',
            errors: parserErrors(error),
            body: edited,
            post,
        });
    }
});

actionContrroller.get('/:id/rent', hasUser(), async (req, res) => {
    const post = await getPostById(req.params.id);
    console.log(post.pieces);
    try {
        if (post.owner.toString() == req.user._id) {
            throw new Error('Cannot rent your house');
        }

        post.users = [req.user.username + " "];
        await rentHouse(req.params.id, req.user._id);
        res.redirect(`/action/${req.params.id}/details`);

    } catch (error) {
        console.error(error);
        res.render('details', {
            title: 'Details page',
            errors: parserErrors(error),
            post,
        });
    }
})

actionContrroller.get('/:id/delete', async (req, res) => {
    const post = await getPostById(req.params.id);

    if (post.owner.toString() !== req.user._id) {
        return res.redirect('/auth/login');
    }

    await deleteById(req.params.id);
    res.redirect('/catalog');
});



module.exports = actionContrroller;