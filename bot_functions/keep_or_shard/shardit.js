const Discord = require('discord.js');
const client = new Discord.Client();
const axios = require('axios');


var pveWeapons = [];
var pvpWeapons = [];
var topWeapons = [];
const ignoreKeys = ['type', 'mode', 'weaponType'];

/**
 * Add the type of the weapon to its object
 * @param {string} key: Name of the current sheet
 * @param {Object: Weapon} wep: The current weapon that is being added
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
 * Initializes the weapon arrays using the api.
 */
module.exports.initWeaponsApi = (async function () {
    
    /* Get all the arguments from the index page */
    var html = await axios.get(`https://v2-api.sheety.co/cbb6ced6bab1fb2411c6960389d05dc7/destiny2WeaponSuggestions/index`);

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
               iteration 
               TODO: MOVE TO FUNCTION */
            for (var thiswep of tempweaponarr) {
                var typedWep = addType(thisel.sheet, thiswep);
                typedWep.mode = 'PVP';
                delete typedWep.id;
                pvpWeapons.push(typedWep);
            }
        }
    }
    console.log('finished populating weapon arrays');
});

module.exports.bestInCategory = function(msg, sendChannel) {
    var catName = msg.content.substring(6);
    var richEmbed = new Discord.RichEmbed();
    var found = false;

    for (var cat of topWeapons) {
        if (cat.weaponType.toLowerCase() == catName.toLowerCase()) {
            richEmbed.setTitle(`Best ${cat.weaponType}s`);
            const keys = Object.keys(cat);
            const vals = Object.values(cat);
            for (var i = 0; i < keys.length; i++) {
                if (!(ignoreKeys.includes(keys[i]))) {
                    var header = keys[i].charAt(0).toUpperCase() + keys[i].substring(1);
                    header = header.replace(/([A-Z])/g, ' $1').trim();
                    richEmbed.addField(header, vals[i].replace(/\n/g, ' > '));
                }
            }
            found = true;
            break;
        }
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

module.exports.getRolls = function(msg, sendChannel) {
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

    weaponName = weaponName.replace(/\'/g, '');     // Remove apostrophes from comparison
    var richEmbed = new Discord.RichEmbed();        // The element that will be send to the chat channel
    var found = false;
    for (var weapon of thisArr) {
        /* For comparing name, we remove apostrophes and 'the' for ease of use.
           Because different types of weapon have different parts, we check the type before adding to the RichEmbed.
           For every single element, the sheet has elements formatted as 'best\nsecond\nworst. Replace
           newlines with ' > ' to make it easier to read when returned */
        if (weapon.weapon.toLowerCase().replace(/\'/g, '').replace(/^(the) /g, '') == weaponName.toLowerCase().replace(/^(the) /g, '')) {
            const keys = Object.keys(weapon);
            const vals = Object.values(weapon);
            for (var i = 0; i < keys.length; i++) {
                if (i == 0) {
                    richEmbed.setTitle(`${vals[i]} ${mode} rolls`);
                    continue;
                }
                if (isNaN(vals[i]) && !(keys[i] == 'element' && vals[i] == 'Kinetic') && !(ignoreKeys.includes(keys[i]))) {
                    var header = keys[i].charAt(0).toUpperCase() + keys[i].substring(1);
                    header = header.replace(/(^|\/)(\S)/g, s=>s.toUpperCase());
                    richEmbed.addField(header, vals[i].replace(/\n/g, ' > '));
                }
            }
        
            console.log(richEmbed);
            found = true;
            break;
        }
    }

    /* A weapon with that name doesn't exist */
    if (!found) {
        sendChannel.send(`No weapon with that name found.\nUsage: ?rolls weapon_name [pve|pvp]`).catch(err => {
            console.log(err);
        });
        return;
    }

    /* Send the embed to the channel that we received the message from */
    sendChannel.send(richEmbed).catch(err => {
        console.log(err);
    });

}
