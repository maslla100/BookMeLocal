const express = require('express');
const { engine } = require('express-handlebars');
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('passport');
require('./config/passport');
const flash = require('connect-flash');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const dotenv = require('dotenv');
const path = require('path');
const handlebarsHelpers = require('./public/js/handlebars-helper');
const moment = require('moment');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3001;

// Set up Handlebars with helpers
app.engine('handlebars', engine({
    helpers: handlebarsHelpers
}));
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));




// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));


// Import models and database connection
const { sequelize } = require('./models');

// Session Middleware setup with Sequelize Store
const sessionStore = new SequelizeStore({ db: sequelize });
app.use(session({
    secret: process.env.SESSION_SECRET,
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Set up static folder
app.use(express.static(path.join(__dirname, 'public')));

// Flash middleware
app.use(flash());

// Setting up a middleware to make the flash messages accessible in the response locals
app.use((req, res, next) => {
    res.locals.messages = req.flash();
    next();
});

// Routes setup
const routes = require('./routes/index');
app.use(routes);

// Error handling
app.use((req, res, next) => {
    res.status(404).send("Sorry, page not found!");
});

//Ensure DB is running
sequelize.authenticate().then(() => {
    console.log('Database connected successfully.');
    sessionStore.sync().then(() => {
        app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
    });
}).catch(err => {
    console.error('Unable to connect to the database:', err);
});