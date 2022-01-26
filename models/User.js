const {Model, DataTypes} = require('sequelize');
const sequelize = require('../config/connection');
const bcrypt = require('bcrypt');

//create our user model 
class User extends Model {}

//define table columns and configuration 
User.init(
    {
        //Table columns go here
        //define an id column 
        id: {
            //use the special Sequelize DataTypes object provided what type of data it is
            type: DataTypes.INTEGER,
            //this is equivalent of SQL's `NOT NULL` option
            allowNull: false,
            //instruct that this is the primary key
            primaryKey: true,
            //turn on auto increment 
            autoIncrement: true, 
        },
        //define a username column 
        username: {
            type: DataTypes.STRING,
            allowNull: false
        },
        //define an email column
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            //there cannot be any duplicate email values in this table
            unique: true,
            //if allowNull is set to false. we can run out date through validators before creating the table data
            validate: {
                isEmail: true
            }
        },
        //define a password column 
        password: {
            type: DataTypes.STRING, 
            allowNull: false, 
            validate: {
                //this means the pw must be at least 4 characters long
                len: [4]
            }
        }
    },   
    {
        hooks: {
            //set up beforeCreate lifecycle "hook" functionality 
            async beforeCreate(newUserData) {    //We use the beforeCreate() hook to execute the bcrypt hash function on the plaintext password.
                newUserData.password = await bcrypt.hash(newUserData.password, 10);
                return newUserData; //The resulting hashed password is then passed to the Promise object as a newUserData object with a hashed password property. The return statement then exits out of the function, returning the hashed password in the newUserData function.
                    //The async keyword is used as a prefix to the function that contains the asynchronous function. await can be used to prefix the async function, which will then gracefully assign the value from the response to the newUserData's password property. The newUserData is then returned to the application with the hashed password.
            },
            //set up beforeUpdate lifecycle "hook" functionality 
            async beforeUpdate(updatedUserData) {
                updatedUserData.password = await bcrypt.hash(updatedUserData.password, 10);
                return updatedUserData;
            }
        },
        //Table configuration options go here (https://sequelize.org/v5/manual/models-definition.html#configuration))

        //pass in our imported sequelize connection (the direct connection to our database)
        sequelize,
        //don't automatically create createdAT/updatedAT timestamp fields 
        timestamps: false,
        //don't pluralize name of database table
        freezeTableName: true,
        //use underscores instead of camel-casing (i.e `comment_text` not `commentText`)
        underscored: true,
        //make it so our model name stays lowercase in the database
        modelName: 'user'
    }
);

module.exports = User;