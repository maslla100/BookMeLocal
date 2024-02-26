const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcryptjs = require('bcryptjs');
const { User } = require('../models');

// Configure Local Strategy for use by Passport.
passport.use(new LocalStrategy({ usernameField: 'email' },
    async (email, password, done) => {
        console.log("Passport local strategy for email:", email); // Log email being used
        try {
            // Find user by email
            const user = await User.findOne({ where: { email: email } });
            console.log("User found:", user ? user.email : 'No user found'); // Log if user is found or not
            if (!user) {
                console.log("Incorrect email"); // Log if email is incorrect
                return done(null, false, { message: 'Incorrect email.' });
            }

            // Compare hashed password
            const match = await bcryptjs.compare(password, user.password);
            console.log("Password match:", match); // Log password match result
            if (!match) {
                console.log("Incorrect password"); // Log if password is incorrect
                return done(null, false, { message: 'Incorrect password.' });
            }
            console.log("Authentication successful for:", user.email); // Log successful authentication
            return done(null, user);
        } catch (err) {
            console.error("Error in Passport local strategy:", err); // Log any errors
            return done(err);
        }
    }
));

// Serialize user into the session
passport.serializeUser((user, done) => {
    console.log("Serializing user:", user.id); // Log the user ID being serialized
    done(null, user.id);
});

// Deserialize user from the session
passport.deserializeUser(async (id, done) => {
    console.log("Deserializing user with ID:", id); // Log the user ID being deserialized
    try {
        const user = await User.findByPk(id);
        if (!user) {
            // If the user is not found, handle it appropriately
            console.log("User not found during deserialization, ID:", id); // Log if user not found
            return done(null, false, { message: 'User not found' });
        }
        console.log("User deserialized successfully:", user.id); // Log successful deserialization
        done(null, user);
    } catch (err) {
        console.error("Error in deserialization:", err); // Log any errors
        done(err);
    }
});



module.exports = passport;
