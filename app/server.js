const express = require('express');
const mongoClient = require('mongodb').MongoClient;

const config = require('./utils/config');

const app = express();

mongoClient.connect(config.db.uri, { useUnifiedTopology: true })
    .then((client) => {
       app.set('db', client.db());
       app.use(express.json());
       require('./routes')(app);
       require('./error-handlers')(app);
       app.listen(config.app.port, config.app.host, () => {
          console.log(`Running server on ${config.app.host}:${config.app.port}.`);
       });
    })
    .catch((err) => console.error(err));


