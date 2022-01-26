const User = require('./User');
const Post = require('./Post');

//create associations 
User.hasMany(Post, {   //This association creates the reference for the id column in the User model to link to the corresponding foreign key pair, which is the user_id in the Post model.
    foreignKey: 'user_id'
});

Post.belongsTo(User, {  //In this statement, we are defining the relationship of the Post model to the User. The constraint we impose here is that a post can belong to one user, but not many users. Again, we declare the link to the foreign key, which is designated at user_id in the Post model.
    foreignKey: 'user_id'
});

module.exports = { User, Post };