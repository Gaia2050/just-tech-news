const router = require('express').Router();

const userRoutes = require('./api/user-routes.js');
const postRoutes = require('./api/post-routes');
const commentRoutes = require('./api/comment-routes');
const homeRoutes = require('./home-routes');

router.use('/users', userRoutes);
router.use('/posts', postRoutes);
router.use('/comments', commentRoutes);
router.use('/', homeRoutes);

module.exports = router;
