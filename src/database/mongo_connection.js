const assert = require('assert');
const MongoClient = require('mongodb').MongoClient;

/** @type {MongoClient} */
let mongoClient = null;

/**
 * Get the Mongo client
 * @returns {Promise<MongoClient>}
*/
function get() {
    return new Promise(res => {
        if (mongoClient != null) {
            res(mongoClient);
            return;
        }

        const url = process.env.CONNECT_URL || require('../../dbconfig.json').url;

        MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, (err, client) => {
            assert.equal(null, err);
            mongoClient = client;
            res(client);
        });
    });
}

module.exports.get = get;