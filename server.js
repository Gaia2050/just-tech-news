const express = require('express');
const controllers = require('./controllers');
const sequelize = require('./config/connection');
const path = require('path');
const exphbs = require('express-handlebars');
const hbs = exphbs.create({});
const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);

const app = express();
const PORT = process.env.PORT || 3001;
const sess = {    //As you may be able to guess, "Super secret secret" should be replaced by an actual secret and stored in the .env file. All we need to do to tell our session to use cookies is to set cookie to be {}. If we wanted to set additional options on the cookie, like a maximum age, we would add the options to that object.
    secret: 'Super secret secret',
    cookie: {},
    resave: false,
    saveUninitialized: true,
    store: new SequelizeStore({
        db: sequelize
    })
};

app.use(session(sess));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));  //The express.static() method is a built-in Express.js middleware function that can take all of the contents of a folder and serve them as static assets. This is useful for front-end specific files like images, style sheets, and JavaScript files.

//turn on routes
app.use(controllers);

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

//turn on connection to db and server
sequelize.sync({ force: true }).then(() => {  //In the sync method, there is a configuration parameter { force: false }. If we change the value of the force property to true, then the database connection must sync with the model definitions and associations. By forcing the sync method to true, we will make the tables re-create if there are any association changes.  performs similarly to DROP TABLE IF EXISTS
    app.listen(PORT, () => console.log('Now listening'))
})