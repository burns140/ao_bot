const assert = require('assert');
const MongoClient = require('mongodb').MongoClient;

// create one mongo client because creating one every time it is needed is slow
//  see https://stackoverflow.com/questions/10656574/how-do-i-manage-mongodb-connections-in-a-node-js-web-application#answer-14464750

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

        var url;
        const testing = false;
        if (testing) {
            url = require('../../dbconfig.json').url;
        } else {
            url = process.env.CONNECT_URL;
        }

        MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, (err, client) => {
            assert.equal(null, err);
            mongoClient = client;
            res(client);
        });
    });
}

module.exports.get = get;