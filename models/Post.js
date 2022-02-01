const { Model, DataTypes} = require('sequelize');
const sequelize = require('../config/connection');
const { post } = require('../controllers');

//Create the post model 
class Post extends Model {
    static upvote(body, models) {  //Here, we're using JavaScript's built-in static keyword to indicate that the upvote method is one that's based on the Post model and not an instance method
        return models.Vote.create({
            user_id: body.user_id,
            post_id: body.post_id
        }).then(() => {
            return Post.findOne({
                where: {
                    id: body.post_id
                },
                attributes: [
                    'id',
                    'post_url',
                    'title',
                    'created_at',
                    [
                        sequelize.literal('(SELECT COUNT (*) FROM vote WHERE post.id = vote.post_id)'),
                        'vote_count'
                    ]
                ]
            });
        });
    }
}
Post.init(  // In the first parameter for the Post.init function, we define the Post schema. 
    {
        id: {   // identified the id column as the primary key and set it to auto-increment
            type: DataTypes.INTEGER,
            allowNUll: false, 
            primaryKey: true, 
            autoIncrement: true
        },
        title: {  //define the title column as a String value.
            type: DataTypes.STRING,
            allowNull: false
        },
        post_url: {   //Then we include the post_url field, which is also defined as a String. Sequelize has the ability to offer validation in the schema definition. Here, we ensure that this url is a verified link by setting the isURL property to true.
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isURL: true
            }
        },
        user_id: {   //this column determines who posted the news article. Using the references property, we establish the relationship between this post and the user by creating a reference to the User model, specifically to the id column that is defined by the key property, which is the primary key. The user_id is conversely defined as the foreign key and will be the matching link.
            type: DataTypes.INTEGER,
            references: {
                model: 'user',
                key: 'id'
            }
        }
    },
    {
        sequelize,
        freezeTableName: true,
        underscored: true,
        modelName: 'post'
    }
);

module.exports = Post;