// routes/index.js

const authRoutes = require('./authRoutes');

module.exports = (app) => {
    app.use('/auth', authRoutes);
    // Define other route handlers
};
