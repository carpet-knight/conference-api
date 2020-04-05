const config = require('../utils/config');
const responseBody = require('../utils/response-body');

module.exports = (app) => {
    app.route('/conferences')
        .get((req, res, next) => {
            const dbQuery = {
                options: {
                    limit: parseInt(req.query.limit) || config.db.defaultLimit,
                    skip: parseInt(req.query.offset) || config.db.defaultOffset,
                },
                query: prepareQuery(req.query)
            };
            sendResponse(req, res, next, dbQuery);
        })
        .post((req, res, next) => {
            const dbQuery = {
                query: prepareQuery(req.body.query) || {},
                options: {
                    projection: req.body.fields || {},
                    limit: parseInt(req.body.limit) || config.db.defaultLimit,
                    skip: parseInt(req.body.offset) || config.db.defaultOffset,
                    sort: req.body.sort || {},
                }
            };
            sendResponse(req, res, next, dbQuery);
        });

    app.get('/conferences/:title', (req, res, next) => {
        const dbQuery = {
            query: req.params,
            options: {},
        };
        sendResponse(req, res, next, dbQuery);
    });
};

function sendResponse(req, res, next, dbQuery) {
    req.app.get('db').collection('conferences')
        .find(dbQuery.query, dbQuery.options)
        .toArray()
        .then((docs) => res.json(responseBody.success(docs)))
        .catch((err) => next(err));
}

function prepareQuery(query) {
    if (query) {
        if (query.hasOwnProperty('attendance') && typeof query.attendance !== 'object') {
            query.attendance = parseInt(query.attendance);
        }
        findAndCall('dateStart', query, convertToDate);
        findAndCall('dateFinish', query, convertToDate);
        if (query.hasOwnProperty('limit')) delete query.limit;
        if (query.hasOwnProperty('offset')) delete query.offset;
    }
    return query;
}

function findAndCall(aim, obj, callback) {
    for (let prop in obj) {
        if (prop === aim) {
            callback(obj, prop);
        }
        else if (typeof obj[prop] === 'object') {
            findAndCall(aim, obj[prop], callback);
        }
    }
}

function convertToDate(obj, prop) {
    const comparisonOperators = [
        '$eq',
        '$gt',
        '$gte',
        '$lt',
        '$lte',
        '$ne',
    ];
    const arrOperators = [
        '$in',
        '$nin',
    ];

    if (typeof obj[prop] === 'object') {
        const nestedObj = obj[prop];

        for (let property in nestedObj) {
            if (comparisonOperators.indexOf(property) + 1) {
                nestedObj[property] = new Date(nestedObj[property]);
            } else if (arrOperators.indexOf(property) + 1) {
                if (Object.prototype.toString.call(nestedObj[property]) === '[object Array]') {
                    for (let i = 0; i < nestedObj[property].length; ++i) {
                        nestedObj[property][i] = new Date(nestedObj[property][i]);
                    }
                }
            }
        }
    } else {
        obj[prop] = new Date(obj[prop]);
    }
}