var fs = require('fs');
const Discord = require('discord.js');
const client = new Discord.Client();

var pveWeapons = [];
var pvpWeapons = [];

function addType(arr, key) {
    if (key.includes('Auto Rifles')) {
        for (var i = 0; i < arr.length; i++) {
            arr[i].TYPE = "Auto Rifle";
        }
    } else if (key.includes('Bow')) {
        for (var i = 0; i < arr.length; i++) {
            arr[i].TYPE = "Bow";
        }
    } else if (key.includes('Fusion Rifle')) {
        for (var i = 0; i < arr.length; i++) {
            arr[i].TYPE = "Fusion Rifle";
        }
    } else if (key.includes('Grenade Launcher')) {
        for (var i = 0; i < arr.length; i++) {
            arr[i].TYPE = "Grenade Launcher";
        }
    } else if (key.includes('Hand Cannon')) {
        for (var i = 0; i < arr.length; i++) {
            arr[i].TYPE = "Hand Cannon";
        }
    } else if (key.includes('Machine Gun')) {
        for (var i = 0; i < arr.length; i++) {
            arr[i].TYPE = "Machine Gun";
        }
    } else if (key.includes('Pulse Rifle')) {
        for (var i = 0; i < arr.length; i++) {
            arr[i].TYPE = "Pulse Rifle";
        }
    } else if (key.includes('Rocket Launcher')) {
        for (var i = 0; i < arr.length; i++) {
            arr[i].TYPE = "Rocket Launcher";
        }
    } else if (key.includes('Scout Rifle')) {
        for (var i = 0; i < arr.length; i++) {
            arr[i].TYPE = "Scout Rifle";
        }
    } else if (key.includes('Shotgun')) {
        for (var i = 0; i < arr.length; i++) {
            arr[i].TYPE = "Shotgun";
        }
    } else if (key.includes('Sidearm')) {
        for (var i = 0; i < arr.length; i++) {
            arr[i].TYPE = "Sidearm";
        }
    } else if (key.includes('Sniper Rifle')) {
        for (var i = 0; i < arr.length; i++) {
            arr[i].TYPE = "Sniper Rifle";
        }
    } else if (key.includes('Submachine Gun')) {
        for (var i = 0; i < arr.length; i++) {
            arr[i].TYPE = "Submachine Gun";
        }
    } else if (key.includes('Sword')) {
        for (var i = 0; i < arr.length; i++) {
            arr[i].TYPE = "Sword";
        }
    }
    return arr;
}


module.exports.initWeapons = function() {
    //var content = fs.readFileSync('C:/Users/steph/Desktop/ao/ao_bot/bot_functions/keep_or_shard/JSON/Destiny 2 Roll Exporter.json');
    var content = fs.readFileSync('bot_functions/keep_or_shard/JSON/Destiny 2 Roll Exporter.json');
    var weapons = JSON.parse(content);

    for (var key in weapons) {
        var thisArr = addType(weapons[key], key);
        if (key.includes('PVE')) {
            for (var i = 0; i < thisArr.length; i++) {
                pvpWeapons.push(thisArr[i]);
            }
        } else if (key.includes('PVP')) {
            for (var i = 0; i < thisArr.length; i++) {
                pveWeapons.push(thisArr[i]);
            }
        }
    }

    for (var weapon of pveWeapons) {
        weapon.MODE = 'PvE';
    }
    for (var weapon of pvpWeapons) {
        weapon.MODE = 'PvP';
    }

    var weaponArrs = {
        "pveWeapons": pveWeapons,
        "pvpWeapons": pvpWeapons
    }

    return weaponArrs;
}

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
        if (weapon.WEAPON.toLowerCase() == weaponName.toLowerCase()) {
            richEmbed.setTitle(`${weapon.WEAPON} ${weapon.MODE} rolls`);
            if (weapon.TYPE == 'Auto Rifle') {
                richEmbed.addField('Sight/Barrel', weapon['SIGHT/BARREL'].replace(/\n/g, ' > '));
                richEmbed.addField('Magazine', weapon.MAGAZINE.replace(/\n/g, ' > '));
            } else if (weapon.TYPE == 'Bow') {
                richEmbed.addField('String', weapon.STRING.replace(/\n/g, ' > '));
                richEmbed.addField('Arrow', weapon.ARROW.replace(/\n/g, ' > '));
            } else if (weapon.TYPE == 'Fusion Rifle') {
                richEmbed.addField('Sight/Barrel', weapon['SIGHT/BARREL'].replace(/\n/g, ' > '));
                richEmbed.addField('Battery', weapon.BATTERY.replace(/\n/g, ' > '));
            } else if (weapon.TYPE == 'Grenade Launcher') {
                richEmbed.addField('Barrel', weapon.BARREL.replace(/\n/g, ' > '));
                richEmbed.addField('Magazine', weapon.MAGAZINE.replace(/\n/g, ' > '));
            } else if (weapon.TYPE == 'Hand Cannon') {
                richEmbed.addField('Sight/Barrel', weapon['SIGHT/BARREL'].replace(/\n/g, ' > '));
                richEmbed.addField('Magazine', weapon.MAGAZINE.replace(/\n/g, ' > '));
            } else if (weapon.TYPE == 'Machine Gun') {
                richEmbed.addField('Barrel', weapon.BARREL.replace(/\n/g, ' > '));
                richEmbed.addField('Magazine', weapon.MAGAZINE.replace(/\n/g, ' > '));
            } else if (weapon.TYPE == 'Pulse Rifle') {
                richEmbed.addField('Sight/Barrel', weapon['SIGHT/BARREL'].replace(/\n/g, ' > '));
                richEmbed.addField('Magazine', weapon.MAGAZINE.replace(/\n/g, ' > '));
            } else if (weapon.TYPE == 'Rocket Launcher') {
                richEmbed.addField('Barrel', weapon.BARREL.replace(/\n/g, ' > '));
                richEmbed.addField('Magazine', weapon.MAGAZINE.replace(/\n/g, ' > '));
            } else if (weapon.TYPE == 'Scout Rifle') {
                richEmbed.addField('Sight/Barrel', weapon['SIGHT/BARREL'].replace(/\n/g, ' > '));
                richEmbed.addField('Magazine', weapon.MAGAZINE.replace(/\n/g, ' > '));
            } else if (weapon.TYPE == 'Shotgun') {
                richEmbed.addField('Barrel', weapon.BARREL.replace(/\n/g, ' > '));
                richEmbed.addField('Magazine', weapon.MAGAZINE.replace(/\n/g, ' > '));
            } else if (weapon.TYPE == 'Sidearm') {
                richEmbed.addField('Sight/Barrel', weapon['SIGHT/BARREL'].replace(/\n/g, ' > '));
                richEmbed.addField('Magazine', weapon.MAGAZINE.replace(/\n/g, ' > '));
            } else if (weapon.TYPE == 'Sniper Rifle') {
                richEmbed.addField('Sight/Barrel', weapon['SIGHT/BARREL'].replace(/\n/g, ' > '));
                richEmbed.addField('Magazine', weapon.MAGAZINE.replace(/\n/g, ' > '));
            } else if (weapon.TYPE == 'Submachine Gun') {
                richEmbed.addField('Sight/Barrel', weapon['SIGHT/BARREL'].replace(/\n/g, ' > '));
                richEmbed.addField('Magazine', weapon.MAGAZINE.replace(/\n/g, ' > '));
            } else if (weapon.TYPE == 'Sword') {
                richEmbed.addField('Blade', weapon.BLADE.replace(/\n/g, ' > '));
                richEmbed.addField('Guard', weapon.GUARD.replace(/\n/g, ' > '));
                richEmbed.addField('Magazine', weapon.MAGAZINE.replace(/\n/g, ' > '));
                richEmbed.addField('Trait', weapon.TRAIT.replace(/\n/g, ' > '));
            }
            if (weapon.TYPE != 'Sword') {
                richEmbed.addField('Trait 1', weapon['TRAIT 1'].replace(/\n/g, ' > '));
                richEmbed.addField('Trait 2', weapon['TRAIT 2'].replace(/\n/g, ' > '));
            }
            richEmbed.addField('Masterwork', weapon.MASTERWORK.replace(/\n/g, ' > '));
            richEmbed.addField('Mod', weapon.MOD.replace(/\n/g, ' > '));
            console.log(richEmbed);
            found = true;
            break;
        }
    }

    if (!found) {
        /*sendChannel.send(`No rolls found for ${weaponName} in ${mode}`).catch(err => {
            console.log(err);
        })*/
        sendChannel.send(`Jiang disapproves of your weapon choices`).catch(err => {
            console.log(err);
        })
        return;
    }

    sendChannel.send(richEmbed).catch(err => {
        console.log(err);
    })

}
