const conferencesRoutes = require('./conferences');
const responseBody = require('../utils/response-body');

module.exports = (app) => {
    conferencesRoutes(app);

    app.use('/', (req, res) => {
        res.status(400).json(responseBody.notFound());
    });
};