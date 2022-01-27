const router = require('express').Router();
const userRoutes = require('./user-routes.js');
const commentRoutes = require('./comment-routes');

router.use('/users', userRoutes);
router.use('/comments', commentRoutes);   //Now all of the routes defined in comment-routes.js will have a /comments prefix. This is how you can easily scale APIs; just add a new endpoint!

module.exports = router;