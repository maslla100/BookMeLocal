// Import necessary modules
const express = require('express');
const { engine } = require('express-handlebars');
const bodyParser = require('body-parser');
const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const passport = require('./config/passport');
const flash = require('connect-flash');
const dotenv = require('dotenv').config();
const path = require('path');
const rateLimit = require('express-rate-limit');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3001;

// Apply Helmet for setting secure HTTP headers
const helmet = require('helmet');

app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            "default-src": ["'self'"],
            "script-src": [
                "'self'",
                "https://cdn.jsdelivr.net",
                "https://ajax.googleapis.com",
                "https://cdnjs.cloudflare.com",
            ],
            "style-src": [
                "'self'",
                "https://cdn.jsdelivr.net",
                "'unsafe-inline'"
            ],
            "img-src": ["'self'", "data:"],
            "connect-src": ["'self'"],
        },
    },

}));


// Apply rate limiting to all requests
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});
app.use(limiter);

// Set up Handlebars with custom helpers
const handlebarsHelpers = require('./public/js/handlebars-helper');
app.engine('handlebars', engine({ helpers: handlebarsHelpers }));
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

// Static folder setup
app.use(express.static(path.join(__dirname, 'public')));

// Import models and database connection
const { sequelize } = require('./models');

// Setup session with Sequelize store
const sessionStore = new SequelizeStore({ db: sequelize });
const sessionConfig = {
    secret: process.env.SESSION_SECRET,
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {}
};
if (process.env.NODE_ENV === 'production') {
    app.set('trust proxy', 1); // Trust first proxy
    sessionConfig.cookie.secure = true; // Serve secure cookies
}
app.use(session(sessionConfig));

// Passport middleware setup
app.use(passport.initialize());
app.use(passport.session());

// Flash messages middleware
app.use(flash());

// Make flash messages accessible in response
app.use((req, res, next) => {
    res.locals.messages = req.flash();
    next();
});

// Routes
const routes = require('./routes/index');
app.use(routes);

// Error handling
app.use((error, req, res, next) => {
    console.error(error.stack);
    const statusCode = error.statusCode || 500; // Default to 500 if statusCode not set
    res.status(statusCode).json({ message: error.message || "An unexpected error occurred" });
});

// Catch 404 and forward to error handler
app.use((req, res, next) => {
    res.status(404).send("Sorry, page not found!");
});

// Database connection check and server start
sequelize.authenticate().then(() => {
    console.log('Database connected successfully.');
    sessionStore.sync().then(() => {
        app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
    });
}).catch(err => {
    console.error('Unable to connect to the database:', err);
});
