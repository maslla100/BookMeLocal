const express = require('express');
const { engine } = require('express-handlebars');
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('passport'); // Only one import of passport
require('./config/passport'); // Importing your Passport configuration
const flash = require('connect-flash');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const dotenv = require('dotenv');
const path = require('path');


// Load environment variables
dotenv.config();

// Import models and database connection
//const db = require('./models');
const { sequelize } = require('./models');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Set up Handlebars
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Session Middleware setup with Sequelize Store
const sessionStore = new SequelizeStore({ db: sequelize });
console.log("Current Environment:", process.env.NODE_ENV);
app.use(session({
    secret: process.env.SESSION_SECRET,
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
}));

//persistant session logging - troubleshooting
app.use((req, res, next) => {
    console.log("Session data on subsequent request:", req.session);
    next();
});


// Sync the session store
sessionStore.sync();


// Passport middleware
app.use(passport.initialize());
app.use(passport.session());



// Set up static folder
app.use(express.static('/public'));

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
console.log("Routes setup complete")


// Error handling
app.use((req, res, next) => {
    res.status(404).send("Sorry, page not found!");
});



//server start
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

