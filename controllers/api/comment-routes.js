const router = require('express').Router();
const req = require('express/lib/request');
const res = require('express/lib/response');
const { Comment, Post } = require('../../models');

router.get('/', (req, res) => {
Comment.findAll()
});

router.post('/', (req, res) => {
    Comment.create({
        comment_text: req.body.comment_text,
        user_id: req.body.user_id,
        post_id: req.body.post_id
    })
        .then(dbCommentData => res.json(dbCommentData))
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        })
});

router.delete('/:id', (req, res) => {
    Post.destroy({
        where: {
            id: req.params.id
        }
    })
    .then(dbCommentData => {
        if(!dbCommentData) {
            res.status(404).json({message: 'No comment found'});
            return; 
        }
        res.json(dbCommentData);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});



module.exports = router;