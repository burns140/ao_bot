const Discord = require('discord.js');
const axios = require('axios');
const MongoClient = require('../../database/mongo_connection.js');

var pveWeapons = [];    // Store rolls for PvE
var pvpWeapons = [];    // Store rolls for PvP
var topWeapons = [];    // Store top weapons from each category
const subMachineStrings = ['smg', 'smgs', 'subs', 'sub', 'submachine guns'];                        // Strings referencing SMG 
const autoStrings = ['assault', 'assaults', 'ar', 'ars', 'auto', 'autos', 'auto rifles'];           // Strings referencing auto rifles
const sniperStrings = ['sniper', 'snipers', 'snipe', 'sniper rifles'];                              // Strings referencing snipers
const linearFusionStrings = ['linear fusion', 'linear', 'linear rifles', 'linear fusion rifles'];   // Strings referencing linear fusions
const ignoreKeys = ['type', 'mode', 'weaponType', 'slot', 'energy', 'ammo', 'archetype'];           // Values to not include in embed

const API_BASE = `https://sheet.best/api/sheets/9b77fc0e-bfae-47d8-83a3-34ed71ef475b/tabs/`
const API_SPECS = [`PVE_Top`, `PVE_Rolls`, `PVP_Rolls`];

module.exports.updateDatabaseFromLink = (async function (sheet) {
    try {
        let link = API_BASE + sheet;
        let html = await axios.get(link);
        MongoClient.get().then(client => {
            const db = client.db('weapons');
            let weaponArr = html.data;

            if (!sheet.includes("Top")) {
                for (var thisWeapon of weaponArr) {
                    db.collection(`${sheet}`).findOneAndReplace(
                        { weapon: thisWeapon["weapon"] },
                        thisWeapon,
                        { upsert: true }
                    ).then(result => {
                        if (!result) {
                            throw new Error(`no result`);
                        }
                    }).catch(err => {
                        console.log(err);
                        sendChannel.send(`Failed to update ${type} weapons`)
                    });
                }
            } else {
                for (var thisCategory of weaponArr) {
                    db.collection(`${sheet}`).findOneAndReplace(
                        { "weapon type": thisCategory["weapon type"] },
                        thisCategory,
                        { upsert: true }
                    ).then(result => {
                        if (!result) {
                            throw new Error(`no result`);
                        }
                    }).catch(err => {
                        console.log(err);
                        sendChannel.send(`Failed to update ${type} weapons`)
                    });
                }
            }
        }).catch(err => {
            console.log(err);
        }); 
    } catch (err) {
        console.log(err);
    }
});

module.exports.updateDatabaseFromApi = (async function () {
    for (sheet of API_SPECS) {
        this.updateDatabaseFromLink(sheet);
    }
});

module.exports.initializeArrays = (async function () {
    pveWeapons, pvpWeapons, topWeapons = [];
    this.populateWeaponArrayFromDatabase(API_SPECS[0], topWeapons);
    this.populateWeaponArrayFromDatabase(API_SPECS[1], pveWeapons);
    this.populateWeaponArrayFromDatabase(API_SPECS[2], pvpWeapons);
})

module.exports.populateWeaponArrayFromDatabase = (async function (sheet, arr) {
    try {
        MongoClient.get().then(client => {
            const db = client.db('weapons');

            db.collection(sheet).find()
            .toArray().then(result => {
                for (var weapon of result) {
                    arr.push(weapon);
                }
                console.log(`populated ${sheet} from db`)
            });
        });
    } catch (err) {
        console.log(err);
    }
});

/**
 * Create embeds when someone requests best weapons from a category 
 */
module.exports.bestInCategory = (async function(msg, sendChannel) {
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
            if (cat["weapon type"].toLowerCase() == catName.toLowerCase()) {
                richEmbed.setTitle(`Best ${cat["weapon type"]}s`);
                const keys = Object.keys(cat);
                const vals = Object.values(cat);

                /* If the field is not set to be ignored, format the text and add said field to the embed
                Mark boolean as true so I know not to send help message */
                for (var i = 0; i < keys.length; i++) {
                    if (!(ignoreKeys.includes(keys[i]))) {
                        var header = keys[i].charAt(0).toUpperCase() + keys[i].substring(1);
                        if (keys[i] == "_id" || keys[i] == `weapon type`) {
                            continue;
                        }
                        var strArr = header.split(' ');
                        for (let i = 0; i < strArr.length; i++) {
                            let lowerstr = strArr[i].toLowerCase();
                            let formatStr = lowerstr.charAt(0).toUpperCase() + lowerstr.substring(1);
                            strArr[i] = formatStr;
                        }
                        header = strArr.join(' ');
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

})

/**
 * Get the best rolls for a weapon
 */
module.exports.getRolls = (async function (msg, sendChannel) {
    var thisArr;
    var mode;
    var content = msg.content.substring(1);
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
    var richEmbed = new Discord.RichEmbed();        // The element that will be send to the chat channel
    var found = false;
    var i = 0;
    try {
        for (var weapon of thisArr) {
            /* For comparing name, we remove apostrophes and 'the' for ease of use.
            Because different types of weapon have different parts, we check the type before adding to the RichEmbed.
            For every single element, the sheet has elements formatted as 'best\nsecond\nworst. Replace
            newlines with ' > ' to make it easier to read when returned */
            if (weapon["weapon"].toLowerCase().replace(/\'/g, '').replace(/^(the) /g, '') == weaponName.toLowerCase().replace(/^(the) /g, '')) {
                const keys = Object.keys(weapon);
                const vals = Object.values(weapon);
                for (var i = 1; i < keys.length; i++) {
                    if (i == 1) {
                        richEmbed.setTitle(`${vals[i]} ${mode} rolls`);
                        continue;
                    }
                    if (isNaN(vals[i]) && !(keys[i] == 'element' && vals[i] == 'Kinetic') && !(ignoreKeys.includes(keys[i])) && !(vals[i] == 'n/a')) {
                        var header = keys[i].charAt(0).toUpperCase() + keys[i].substring(1);
                        header = header.replace(/(^|\/)(\S)/g, s=>s.toUpperCase());
    
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
        sendChannel.send(`No weapon with that name found.\nIt is possible this weapon has been sunsetted so data is no longer available.\nUsage: ?rolls weapon_name [pve|pvp]`).catch(err => {
            console.log(err);
        });
        return;
    }

    /* Send the embed to the channel that we received the message from */
    sendChannel.send(richEmbed).catch(err => {
        console.log(err);
    });
})