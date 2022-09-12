const router = require('express').Router();
const path = require('path');
const apiRoutes = require('./api');
const Auth = require('./api/Auth');

// Take in a passport and return a router //
module.exports = function(passport, User) {
    // API Routes
    router.use('/api', apiRoutes(passport));
    router.use('/Auth', Auth(passport, User));

    // If no User is found, send to app //
    router.use((req, res) => {
        res.sendFile(path.join(__dirname, '../client/src/routes/app.html'));
    });
    return router;
}