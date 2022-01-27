const router = require('express').Router();
const res = require('express/lib/response');
const { Post, User, Vote, Comment } = require('../../models');
const sequelize = require('../../config/connection');


//get all users 
router.get('/', (req, res) => {
    Post.findAll({
        order: [['created_at', 'DESC']],
        //Query configuration
        attributes:
            ['id',
                'post_ur',
                'title',
                'created_at',
                [sequelize.literal('(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)'), 'vote_count']
            ],
        include: [
            {
                model: Comment,
                attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
                include: {
                    model: User,
                    attributes: ['username']
                }
            },
            {
                model: User,
                attributes: ['username']
            }
        ]
    })
        .then(dbPostData => res.join(dbPostData))
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });

});

router.get('/:id', (req, res) => {
    Post.findOne({
        where: {
            id: req.params.id
        },
        attributes:
            ['id',
                'post_url',
                'title',
                'created_at',
                [sequelize.literal('(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)'), 'vote_count']
            ],
        include: [
            // include the Comment model here:
            {
                model: Comment,
                attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
                include: {
                    model: User,
                    attributes: ['username']
                }
            },              //Notice that the include property is expressed as an array of objects. To define this object, we need a reference to the model and attributes.
            {
                model: User,
                attributes: ['username']
            }
        ]
    })
        .then(dbPostData => {
            if (!dbPostData) {
                res.status(404).json({ message: 'No post found with this id' });
                return;
            }
            res.json(dbPostData);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

router.post('/', (req, res) => {
    Post.create({
        title: req.body.title,
        post_url: req.body.post_url,
        user_id: req.body.user_id
    })
        .then(dbPostData => res.json(dbPostData))
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        })
})


//create the vote---PUT/api/posts/upvote Make sure this PUT route is defined before the /:id PUT route, though. Otherwise, Express.js will think the word "upvote" is a valid parameter for /:id.
router.put('/upvote', (req, res) => {
    //custom static method created in models/Post.js
    Post.upvote(req.body. { Vote })
        .then(updatedPostData => res.json(updatedPostData))
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        });
});





// router.put('/upvote', (req, res) => {
//     Vote.create({
//         user_id: req.body.user_id,
//         post_id: req.body.post_id
//     }).then(() => {
//         //then find thr post we just voted on 
//         return Post.findOne({
//             where: {
//                 id: req.body.post_id
//             },
//             attributes: [
//                 'id',
//                 'post_url',
//                 'title',
//                 'created_at',
//                 // use raw MySQL aggregate function query to get a count of how many votes the post has and return it under the name `vote_count`
//                 [
//                     sequelize.literal('(SELECT COUNT (*) FROM vote WHERE post.id = vote.post_id)'),
//                     'vote_count'
//                 ]
//             ]
//         })
//             .then(dbPostData => res.json(dbPostData))
//             .catch(err => {
//                 console.log(err);
//                 res.status(400).json(err);
//             });
//     })

router.put('/:id', (req, res) => {
    Post.update(
        {
            title: req.body.title
        },
        {
            where: {
                id: req.params.id
            }
        }
    )
        .then(dbPostData => {
            if (!dbPostData) {
                res.status(404).json({ message: 'No post found with this id' });
                return;
            }
            res.json(dbPostData);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

router.delete('/:id', (req, res) => {
    Post.destroy({
        where: {
            id: req.params.id
        }
    })
        .then(dbPostData => {
            if (!dbPostData) {
                res.status(404).json({ massage: 'No post found with this id' });
                return;
            }
            res.json(dbPostData);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});


module.exports = router;