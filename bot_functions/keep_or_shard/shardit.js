const Discord = require('discord.js');
const client = new Discord.Client();
const axios = require('axios');


var pveWeapons = [];
var pvpWeapons = [];

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

module.exports.initWeaponsApi = (async function () {
    var html = await axios.get(`https://v2-api.sheety.co/cbb6ced6bab1fb2411c6960389d05dc7/destiny2WeaponSuggestions/index`);
    for (var el of html.data.index) {
        var thisel = el;
        var result = await axios.get(`${thisel.url}`);
        var tempweaponarr = result.data[Object.keys(result.data)[0]];
        if (thisel.sheet.includes('PVE')) {
            for (var thiswep of tempweaponarr) {
                var typedWep = addType(thisel.sheet, thiswep);
                typedWep.mode = 'PVE';
                delete typedWep.id;
                pveWeapons.push(typedWep);
            }
        } else if (thisel.sheet.includes('PVP')) {
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

module.exports.getRolls = function(msg, sendChannel) {
    var thisArr;
    var content = msg.content.substring(1);
    var command = content.split(' '); 
    if (command.length == 1) {
        return;
    }
    var weaponName = "";
    var mode = "";
    if (command[command.length - 1].toLowerCase() != 'pve' && command[command.length - 1].toLowerCase() != 'pvp') {
        weaponName = content.substring(6);
        thisArr = pveWeapons;
        mode = 'PvE';
    } else {
        for (var i = 1; i < command.length - 1; i++) {
            weaponName += command[i];
            if (i != command.length - 2) {
                weaponName += ' ';
            }
        }
        if (command[command.length - 1].toLowerCase() == 'pve') {
            thisArr = pveWeapons;
            mode = 'PvE';
        } else {
            thisArr = pvpWeapons;
            mode = 'PvP';
        }
    }

    var richEmbed = new Discord.RichEmbed();
    var found = false;
    for (var weapon of thisArr) {
        if (weapon.weapon.toLowerCase() == weaponName.toLowerCase()) {
            richEmbed.setTitle(`${weapon.weapon} ${weapon.mode} rolls`);
            richEmbed.addField('Obtained', weapon.obtained);
            if (weapon.type == 'Auto Rifle') {
                richEmbed.addField('Sight/Barrel', weapon['sight/barrel'].replace(/\n/g, ' > '));
                richEmbed.addField('Magazine', weapon.magazine.replace(/\n/g, ' > '));
            } else if (weapon.type == 'Bow') {
                richEmbed.addField('String', weapon.string.replace(/\n/g, ' > '));
                richEmbed.addField('Arrow', weapon.arrow.replace(/\n/g, ' > '));
            } else if (weapon.type == 'Fusion Rifle') {
                richEmbed.addField('Sight/Barrel', weapon['sight/barrel'].replace(/\n/g, ' > '));
                richEmbed.addField('Battery', weapon.battery.replace(/\n/g, ' > '));
            } else if (weapon.type == 'Grenade Launcher') {
                richEmbed.addField('Barrel', weapon.barrel.replace(/\n/g, ' > '));
                richEmbed.addField('Magazine', weapon.magazine.replace(/\n/g, ' > '));
            } else if (weapon.type == 'Hand Cannon') {
                richEmbed.addField('Sight/Barrel', weapon['sight/barrel'].replace(/\n/g, ' > '));
                richEmbed.addField('Magazine', weapon.magazine.replace(/\n/g, ' > '));
            } else if (weapon.type == 'Machine Gun') {
                richEmbed.addField('Barrel', weapon.barrel.replace(/\n/g, ' > '));
                richEmbed.addField('Magazine', weapon.magazine.replace(/\n/g, ' > '));
            } else if (weapon.type == 'Pulse Rifle') {
                richEmbed.addField('Sight/Barrel', weapon['sight/barrel'].replace(/\n/g, ' > '));
                richEmbed.addField('Magazine', weapon.magazine.replace(/\n/g, ' > '));
            } else if (weapon.type == 'Rocket Launcher') {
                richEmbed.addField('Barrel', weapon.barrel.replace(/\n/g, ' > '));
                richEmbed.addField('Magazine', weapon.magazine.replace(/\n/g, ' > '));
            } else if (weapon.type == 'Scout Rifle') {
                richEmbed.addField('Sight/Barrel', weapon['sight/barrel'].replace(/\n/g, ' > '));
                richEmbed.addField('Magazine', weapon.magazine.replace(/\n/g, ' > '));
            } else if (weapon.type == 'Shotgun') {
                richEmbed.addField('Barrel', weapon.barrel.replace(/\n/g, ' > '));
                richEmbed.addField('Magazine', weapon.magazine.replace(/\n/g, ' > '));
            } else if (weapon.type == 'Sidearm') {
                richEmbed.addField('Sight/Barrel', weapon['sight/barrel'].replace(/\n/g, ' > '));
                richEmbed.addField('Magazine', weapon.magazine.replace(/\n/g, ' > '));
            } else if (weapon.type == 'Sniper Rifle') {
                richEmbed.addField('Sight/Barrel', weapon['sight/barrel'].replace(/\n/g, ' > '));
                richEmbed.addField('Magazine', weapon.magazine.replace(/\n/g, ' > '));
            } else if (weapon.type == 'Submachine Gun') {
                richEmbed.addField('Sight/Barrel', weapon['sight/barrel'].replace(/\n/g, ' > '));
                richEmbed.addField('Magazine', weapon.magazine.replace(/\n/g, ' > '));
            } else if (weapon.type == 'Sword') {
                richEmbed.addField('Blade', weapon.blade.replace(/\n/g, ' > '));
                richEmbed.addField('Guard', weapon.guard.replace(/\n/g, ' > '));
                richEmbed.addField('Magazine', weapon.magazine.replace(/\n/g, ' > '));
                richEmbed.addField('Trait', weapon.trait.replace(/\n/g, ' > '));
            }
            if (weapon.type != 'Sword') {
                richEmbed.addField('Trait 1', weapon.trait1.replace(/\n/g, ' > '));
                richEmbed.addField('Trait 2', weapon.trait2.replace(/\n/g, ' > '));
            }
            richEmbed.addField('Masterwork', weapon.masterwork.replace(/\n/g, ' > '));
            richEmbed.addField('Mod', weapon.mod.replace(/\n/g, ' > '));
            richEmbed.addField('Notes', weapon.notes);
            console.log(richEmbed);
            found = true;
            break;
        }
    }

    if (!found) {
        sendChannel.send(`Jiang disapproves of your weapon choices`).catch(err => {
            console.log(err);
        })
        return;
    }

    sendChannel.send(richEmbed).catch(err => {
        console.log(err);
    });

}
