const fs = require('fs');
const mongoClient = require('mongodb').MongoClient;

const config = require('../app/utils/config');

mongoClient.connect(config.db.uri, { useUnifiedTopology: true })
    .then((client) => {
        const JSONData = JSON.parse(fs.readFileSync(__dirname + '/conferences.json', 'utf-8'));
        JSONData.forEach((doc) => {
            doc.dateStart = new Date(doc.dateStart);
            doc.dateFinish = new Date(doc.dateFinish);
        });

        client.db().collection('conferences').insertMany(JSONData)
            .then(() => console.log('Data loaded successfully.'))
            .catch((err) => console.error(err))
            .finally(() => client.close());
    })
    .catch((err) => console.error(err));
