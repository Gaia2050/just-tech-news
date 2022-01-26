const router = require('express').Router();
const { User } = require('../../models');

//Get all users
router.get('/', (req, res) => {
    //access our model and run run .findALL()method)
    User.findAll({        // User model inherits functionality from the Sequelize Model class. .findAll() is one of the Model class's methods. The .findAll() method lets us query all of the users from the user table in the database,
        attributes: { exclude: ['password'] }   //provided an attributes key and instructed the query to exclude the password column. It's in an array because if we want to exclude more than one, we can just add more.
    })

        .then(dbUserData => res.json(dbUserData))
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
            // just set up the API endpoint so that when the client makes a GET request to /api/users, we will select all users from the user table in the database and send it back as JSON.
        });
});

//Get single user 
router.get('/:id', (req, res) => {
    User.findOne({
        attributes: { exclude: ['password'] },
        where: {
            id: req.params.id
        }
    })
        .then(dbUserData => {
            if (!dbUserData) {
                res.status(404).json({ message: 'No user found with this id' });
                return;
            }
            res.json(dbUserData);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

//Post/api/users
router.post('/', (req, res) => {
    User.create({   //To insert data, we can use Sequelize's .create() method. Pass in key/value pairs where the keys are what we defined in the User model and the values are what we get from req.body
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
    })
        .then(dbUserData => res.json(dbUserData))
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

//Put /api/users/1
router.put('/:id', (req, res) => {
    // if req.body has exact key/value pairs to match the model, you can just use `req.body` instead
    User.update(req.body, {  //This .update() method combines the parameters for creating data and looking up data
        where: {
            id: req.params.id
        }
    })
        .then(dbUseData => {
            if (!dbUseData[0]) {
                res.status(404).json({ message: 'No user found with this id' });
                return;
            }
            res.json(dbUserData);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

//Delete/api/user/1
router.delete('/:id', (req, res) => {    //To delete data, use the .destroy() method and provide some type of identifier to indicate where exactly we would like to delete data from the user database table.
    User.destroy({
        where: {
            id: req.params.id
        }
    })
        .then(dbUserData => {
            if (!dbUserData) {
                res.status(404).json({ message: 'No user found with this id' });
                return;
            }
            res, json(dbUserData);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});