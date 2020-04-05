module.exports = {
    app: {
        host: 'localhost',
        port: process.env.PORT || 9000,
    },
    db: {
        uri: 'mongodb://localhost:27017/api',
        defaultLimit: 20,
        defaultOffset: 0,
    }
};