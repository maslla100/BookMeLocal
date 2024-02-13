// server.js

const express = require('express');
const session = require('express-session');
const exphbs = require('express-handlebars');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Setup Handlebars
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

// Body Parser Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Session Middleware
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

// Static folder
app.use(express.static('public'));

// Routes
// Assuming you have an index.js in your routes directory that imports all your routes
require('./routes/index')(app);

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
