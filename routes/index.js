const router = require('express').Router();
const apiRoutes = require('./api');

// const userRoutes = require('./user-routes');
// const postRoutes = require('./post-routes');
// const { Post } = require('../models');


// router.use('/users', userRoutes);
// router.use('/posts', postRoutes);
router.use('./api', apiRoutes);

router.use((req, res) => {
    res.status(404).end();
});

module.exports = router;