const MongoClient = require('../database/mongo_connection.js');
const PVEJson = require('./PVE_Rolls.json');
const TOPJson = require('./PVE_Top.json');

async function Main() {
    const PVEArr = PVEJson["PVE_Rolls"];
    const TOPArr = TOPJson["PVE_Top"];

    await uploadArray(PVEArr, 'NewPVE');
    await uploadArray(TOPArr, 'top');
    console.log('done');
}


/**
 * Upload weapon arrays to mongo
 * @param {Weapon []} weaponArray 
 * @param {string} type 
 */
async function uploadArray(weaponArray, type) {
    try {
        MongoClient.get().then(client => {
            const db = client.db('weapons');

            if (type == 'top') {
                for (var thisCategory of weaponArray) {
                    db.collection(`${type}`).findOneAndReplace(
                        { weaponType: thisCategory["WEAPON TYPE"] },
                        { thisCategory },
                        { upsert: true }
                    ).then(result => {
                        if (!result) {
                            throw new Error(`no result`);
                        }
                        console.log(`Updated top ${thisCategory["WEAPON TYPE"]}`);
                    }).catch(err => {
                        console.log(err);
                    })
                }
            } else {
                for (var thisWeapon of weaponArray) {
                    db.collection(`${type}`).findOneAndReplace(
                        { weapon: thisWeapon.weapon },
                        { thisWeapon },
                        { upsert: true }
                    ).then(result => {
                        if (!result) {
                            throw new Error(`no result`);
                        }
                    }).catch(err => {
                        console.log(err);
                    })
                }
            }
        }).catch(err => {
            console.log(err);
        });
    } catch (err) {
        console.log(err);
    }
}

Main();
