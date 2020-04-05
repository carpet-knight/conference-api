const responseBody = require('../utils/response-body');

module.exports = (app) => {
    app.use((err, req, res, next) => {
        if (err.type === 'entity.parse.failed') {
            res.status(400)
                .json(responseBody.custom(400, 'Bad Request', 'Request Body must be valid JSON'));
        } else {
            next(err);
        }
    });

    app.use((err, req, res, next) => {
       if (err.name === 'MongoError') {
           res.status(400)
               .json(responseBody.custom(400, 'Bad Request', 'Incorrect query syntax'));
       } else {
           next(err);
       }
    });

    app.use((err, req, res, next) => {
        console.error(err);
        res.status(500).json(responseBody.serverError());
    });
};