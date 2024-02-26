const ensureAuthenticated = (req, res, next) => {
    console.log("ensureAuthenticated: User authenticated?", req.isAuthenticated());
    if (req.isAuthenticated()) {
        return next();
    }
    console.log("ensureAuthenticated: Redirecting to login");
    res.redirect('/login?message=Access Denied. Please log in.');
};

const ensureRole = (role) => {
    return (req, res, next) => {
        console.log(`ensureRole: Checking role for ${role}`);
        if (req.isAuthenticated() && req.user.role === role) {
            console.log(`ensureRole: User has role ${role}, proceeding`);
            return next();
        }
        console.warn(`Access denied: User with role ${req.user ? req.user.role : 'none'} attempted to access ${role} area`);
        res.status(403).send('Access denied');
    };
};

const ensureCustomer = ensureRole('customer');
const ensureOwner = ensureRole('owner');
const ensureAdmin = ensureRole('admin');

const redirectIfAuthenticated = (req, res, next) => {
    console.log("redirectIfAuthenticated: User already authenticated?", req.isAuthenticated());
    if (req.isAuthenticated() && req.user) {
        console.log(`redirectIfAuthenticated: Redirecting to dashboard for role ${req.user.role}`);
        return res.redirect(getDashboardUrl(req.user.role));
    }
    next();
};

const ensureAdminOrOwner = (req, res, next) => {
    console.log("ensureAdminOrOwner: Checking for admin or owner role");
    if (req.isAuthenticated()) {
        if (req.user.role === 'admin' || req.user.role === 'owner') {
            console.log("ensureAdminOrOwner: Access granted");
            return next();
        }
    }
    console.warn("ensureAdminOrOwner: Access denied");
    res.status(403).send('Access denied');
};

module.exports = {
    ensureAuthenticated,
    ensureCustomer,
    ensureRole,
    ensureOwner,
    ensureAdmin,
    redirectIfAuthenticated,
    ensureAdminOrOwner
};
