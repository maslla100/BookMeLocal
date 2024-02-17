const express = require('express');
const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const exphbs = require('express-handlebars');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const dotenv = require('dotenv');
const flash = require('connect-flash');
const methodOverride = require('method-override');
const moment = require('moment');
const { sequelize } = require('./models');



// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Setup security headers with Helmet
app.use(helmet());

// Rate limiter configuration
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
});

// Apply rate limiting to all requests
app.use('/api/', apiLimiter);

// Setup Handlebars with custom helpers
const hbs = exphbs.create({


    helpers: {
        formatDate: function (date, format) {
            return moment(date).format(format);
        },
        formatDateTime: (date) => date.toISOString().slice(0, 16),
        ifEquals: (arg1, arg2, options) => (arg1 == arg2) ? options.fn(this) : options.inverse(this),
    },
});

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

// Override method for supporting PUT and DELETE in forms
app.use(methodOverride('_method'));

// Body Parser Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Session Middleware setup with Sequelize Store
const sessionStore = new SequelizeStore({ db: sequelize });
app.use(session({
    secret: process.env.SESSION_SECRET,
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: process.env.NODE_ENV === "production", httpOnly: true },
}));

app.use(flash()); // Use connect-flash middleware

// Make flash messages available to all templates
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});

// Sync the session store
sessionStore.sync();

// Static folder setup
app.use(express.static('public'));

// Routes setup
require('./routes/index')(app);

// 404 Not Found Middleware
app.use((req, res, next) => res.status(404).send('404 Not Found'));

// Error Handling Middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
