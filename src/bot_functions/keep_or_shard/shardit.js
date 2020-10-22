const Discord = require('discord.js');
const client = new Discord.Client();
const axios = require('axios');
const info = require('../../resources/info.json');
const MongoClient = require('../../database/mongo_connection.js');


var pveWeapons = [];    // Store rolls for PvE
var pvpWeapons = [];    // Store rolls for PvP
var topWeapons = [];    // Store top weapons from each category
const subMachineStrings = ['smg', 'smgs', 'subs', 'sub', 'submachine guns'];                        // Strings referencing SMG 
const autoStrings = ['assault', 'assaults', 'ar', 'ars', 'auto', 'autos', 'auto rifles'];           // Strings referencing auto rifles
const sniperStrings = ['sniper', 'snipers', 'snipe', 'sniper rifles'];                              // Strings referencing snipers
const linearFusionStrings = ['linear fusion', 'linear', 'linear rifles', 'linear fusion rifles'];   // Strings referencing linear fusions
const ignoreKeys = ['type', 'mode', 'weaponType', 'slot', 'energy', 'ammo', 'archetype'];           // Values to not include in embed

/**
 * Add the type of the weapon to its object
 * @param {string} key: Name of the current sheet
 * @param {Weapon} wep: The current weapon that is being added
 */
function addType(key, wep) {
    if (key.includes('Auto Rifles')) {
        wep.type = "Auto Rifle";
    } else if (key.includes('Bow')) {
        wep.type = "Bow";
    } else if (key.includes('Fusion Rifle')) {
        wep.type = "Fusion Rifle";
    } else if (key.includes('Grenade Launcher')) {
        wep.type = "Grenade Launcher";
    } else if (key.includes('Hand Cannon')) {
        wep.type = "Hand Cannon";
    } else if (key.includes('Machine Gun')) {
        wep.type = "Machine Gun";
    } else if (key.includes('Pulse Rifle')) {
        wep.type = "Pulse Rifle";
    } else if (key.includes('Rocket Launcher')) {
        wep.type = "Rocket Launcher";
    } else if (key.includes('Scout Rifle')) {
        wep.type = "Scout Rifle";
    } else if (key.includes('Shotgun')) {
        wep.type = "Shotgun";
    } else if (key.includes('Sidearm')) {
        wep.type = "Sidearm";
    } else if (key.includes('Sniper Rifle')) {
        wep.type = "Sniper Rifle";
    } else if (key.includes('Submachine Gun')) {
        wep.type = "Submachine Gun";
    } else if (key.includes('Sword')) {
        wep.type = "Sword";
    }
    return wep;
}

/**
 * Initializes the weapon arrays using the api from clan member jiangshi
 */
module.exports.populateWeaponArrayFromApi = (async function (sendChannel) {
    var html;
    /* Get all the arguments from the index page */
    try {
        html = await axios.get(`${info.apiLink}`);
    } catch(err) {
        console.log(`query to api failed`)
        console.log(err);
        console.log(err.response.status);
        if (err.response.status == 402) {
            sendChannel.send('The API people want money.');
        }
        sendChannel.send('Updating weapons failed.');
        return false;
    }
    
    try {
        /* Send request to each link */
        for (var el of html.data.index) {
            var thisel = el;
            var result = await axios.get(`${thisel.url}`);                  
            var tempweaponarr = result.data[Object.keys(result.data)[0]];   // Get the array of weapons from the current table
            if (thisel.sheet.includes('Top')) {
                for (var wepClass of tempweaponarr) {
                    delete wepClass.id;
                    topWeapons.push(wepClass);
                }
            } else if (thisel.sheet.includes('PVE')) {
                /* Iterate through current weapon array */
                for (var thiswep of tempweaponarr) {
                    var typedWep = addType(thisel.sheet, thiswep);          // Add the weapon type
                    typedWep.mode = 'PVE';                                  // Set the mode these rolls are good for
                    delete typedWep.id;                                     // IDs get duplicated, so just delete them
                    pveWeapons.push(typedWep);                              // Add to overall weapon array
                }
            } else if (thisel.sheet.includes('PVP')) {
                /* This is a repeat of the above. I nearly duplicated
                code so that we don't do an if statement in every 
                iteration. Can be moved to function for cleanliness */
                for (var thiswep of tempweaponarr) {
                    var typedWep = addType(thisel.sheet, thiswep);
                    typedWep.mode = 'PVP';
                    delete typedWep.id;
                    pvpWeapons.push(typedWep);
                }
            }
        }
    } catch(err) {
        console.log(`iterating through api return had problems`)
        console.log(err);
        return false;
    }
    
    console.log('finished populating weapon arrays');
});

module.exports.populateWeaponArrayFromDatabase = (async function () {
    try {
        MongoClient.get().then(client => {
            const db = client.db('weapons');

            db.collection('pve').find()
            .toArray().then(result => {
                for (var weapon of result) {
                    pveWeapons.push(weapon);
                }
                console.log('Populated pve array from db');
                console.log(pveWeapons.length);
            }).catch(err => {
                console.log(`pve: ${err}`);
            });

            db.collection('pvp').find()
            .toArray().then(result => {
                for (var weapon of result) {
                    pvpWeapons.push(weapon);
                }
                console.log('Populated pvp array from db');
                console.log(pvpWeapons.length);
            }).catch(err => {
                console.log(`pvp: ${err}`);
            });

            db.collection('top').find()
            .toArray().then(result => {
                for (var weapon of result) {
                    topWeapons.push(weapon);
                }
                console.log('Populated top array from db');
            }).catch(err => {
                console.log(`top: ${err}`);
            });

        });
    } catch (err) {
        console.log(err);
    }
});

/**
 * Create embeds when someone requests best weapons from a category 
 */
module.exports.bestInCategory = function(msg, sendChannel) {
    var catName = msg.content.substring(6);

    /* Allow abbreviations/acronyms */
    if (subMachineStrings.includes(catName)) {
        catName = 'Submachine Gun';
    } else if (autoStrings.includes(catName)) {
        catName = 'Auto Rifle';
    } else if (sniperStrings.includes(catName)) {
        catName = 'Sniper Rifle';
    } else if (linearFusionStrings.includes(catName)) {
        catName = 'Linear Fusion Rifle';
    }


    var richEmbed = new Discord.RichEmbed();
    var found = false;

    /* Create the embed to be returned */
    try {
        for (var cat of topWeapons) {
            if (cat["WEAPON TYPE"].toLowerCase() == catName.toLowerCase()) {
                richEmbed.setTitle(`Best ${cat["WEAPON TYPE"]}s`);
                const keys = Object.keys(cat);
                const vals = Object.values(cat);

                /* If the field is not set to be ignored, format the text and add said field to the embed
                Mark boolean as true so I know not to send help message */
                for (var i = 0; i < keys.length; i++) {
                    if (!(ignoreKeys.includes(keys[i]))) {
                        var header = keys[i].charAt(0).toUpperCase() + keys[i].substring(1);
                        console.log(header);
                        //header = header.replace(/([A-Z])/g, ' $1').trim();
                        //console.log(header);
                        if (keys[i] == "_id" || keys[i] == `WEAPON TYPE`) {
                            continue;
                        }
                        richEmbed.addField(header, vals[i].replace(/\n/g, ' > '));
                    }
                }
                found = true;
                break;
            }
        }
    } catch (ex) {
        console.log(ex);
    }
    

    /* A weapon with that name doesn't exist */
    if (!found) {
        sendChannel.send(`No weapon class found.\nUsage: ?best weapon_class`).catch(err => {
            console.log(err);
        });
        return;
    }

    /* Send the embed to the channel that we received the message from */
    sendChannel.send(richEmbed).catch(err => {
        console.log(err);
    });

}

/**
 * Get the best rolls for a weapon
 */
module.exports.getRolls = function(msg, sendChannel) {
    var thisArr;
    var mode;
    var content = msg.content.substring(1);
    console.log(content);
    var command = content.split(' '); 
    if (command.length == 1) {
        return;
    }
    var weaponName = "";

    /* Determine the mode being played so we know what array to use. If there is no mode argument,
       the name is the only argument so we can take a substring */
    if (command[command.length - 1].toLowerCase() != 'pve' && command[command.length - 1].toLowerCase() != 'pvp') {
        weaponName = content.substring(6);
        thisArr = pveWeapons;
        mode = 'PVE';
    } else {
        /* If there is a mode argument, must split and combine all strings minus the final (mode) element to get weapon name */
        for (var i = 1; i < command.length - 1; i++) {
            weaponName += command[i];
            if (i != command.length - 2) {
                weaponName += ' ';
            }
        }
        /* Set mode after getting weapon name */
        if (command[command.length - 1].toLowerCase() == 'pve') {
            thisArr = pveWeapons;
            mode = 'PVE';
        } else {
            thisArr = pvpWeapons;
            mode = 'PVP';
        }
    }

    if (thisArr == []) {
        return;
    }
    weaponName = weaponName.replace(/\'/g, '');     // Remove apostrophes from comparison
    console.log(weaponName);
    var richEmbed = new Discord.RichEmbed();        // The element that will be send to the chat channel
    var found = false;
    console.log(thisArr);
    var i = 0;
    try {
        for (var weapon of thisArr) {
            console.log(i++);
            /* For comparing name, we remove apostrophes and 'the' for ease of use.
               Because different types of weapon have different parts, we check the type before adding to the RichEmbed.
               For every single element, the sheet has elements formatted as 'best\nsecond\nworst. Replace
               newlines with ' > ' to make it easier to read when returned */
            if (weapon.thisWeapon.weapon.toLowerCase().replace(/\'/g, '').replace(/^(the) /g, '') == weaponName.toLowerCase().replace(/^(the) /g, '')) {
                const keys = Object.keys(weapon.thisWeapon);
                const vals = Object.values(weapon.thisWeapon);
                for (var i = 0; i < keys.length; i++) {
                    if (i == 0) {
                        richEmbed.setTitle(`${vals[i]} ${mode} rolls`);
                        continue;
                    }
                    if (isNaN(vals[i]) && !(keys[i] == 'element' && vals[i] == 'Kinetic') && !(ignoreKeys.includes(keys[i])) && !(vals[i] == 'n/a')) {
                        var header = keys[i].charAt(0).toUpperCase() + keys[i].substring(1);
                        header = header.replace(/(^|\/)(\S)/g, s=>s.toUpperCase());
                        
                        /* Band aid fix for bad formatting */
                        if (header == 'Trait1') {
                            header = 'Trait 1';
                        } else if (header == 'Trait2') {
                            header = 'Trait 2';
                        }
    
                        richEmbed.addField(header, vals[i].replace(/\n/g, ' > '));
                        //richEmbed.addField(header, vals[i].replace(/\n/g, ' > '), true);
                        
                    }
                }
            
                console.log(richEmbed);
                found = true;
                break;
            }
        }
    } catch (ex) {
        console.log(ex);
    }
    

    /* A weapon with that name doesn't exist */
    if (!found) {
        sendChannel.send(`No weapon with that name found. PVP info has not been updated for season of the worthy.\nUsage: ?rolls weapon_name [pve|pvp]`).catch(err => {
            console.log(err);
        });
        return;
    }

    /* Send the embed to the channel that we received the message from */
    sendChannel.send(richEmbed).catch(err => {
        console.log(err);
    });

}

/**
 * Update mongodb with weapon info
 */
module.exports.updateWeaponDb = (async function (sendChannel) {
    pveWeapons = [];
    pvpWeapons = [];
    topWeapons = [];
    if (!await this.populateWeaponArrayFromApi(sendChannel)) {
        return;
    }

    uploadArray(topWeapons, 'top', sendChannel);
    uploadArray(pveWeapons, 'pve', sendChannel);
    uploadArray(pvpWeapons, 'pvp', sendChannel);
});

/**
 * Upload weapon arrays to mongo
 * @param {Weapon []} weaponArray 
 * @param {string} type 
 */
async function uploadArray(weaponArray, type, sendChannel) {
    try {
        MongoClient.get().then(client => {
            const db = client.db('weapons');

            if (type == 'top') {
                for (var thisCategory of weaponArray) {
                    db.collection(`${type}`).findOneAndReplace(
                        { weaponType: thisCategory.weaponType },
                        { thisCategory },
                        { upsert: true }
                    ).then(result => {
                        if (!result) {
                            throw new Error(`no result`);
                        }
                        console.log(`Updated top ${thisCategory.weaponType}`);
                    }).catch(err => {
                        console.log(err);
                        sendChannel.send(`Failed to update ${type} weapons`)
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
                        console.log(`Updated ${thisWeapon.weapon}`);
                    }).catch(err => {
                        console.log(err);
                        sendChannel.send(`Failed to update ${type} weapons`)
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
