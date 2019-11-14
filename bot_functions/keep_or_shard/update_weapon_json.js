var jsdom = require('jsdom');
const { JSDOM } = jsdom;
const { window } = new JSDOM();
const { document } = (new JSDOM('')).window;
global.document = document;
var fs = require('fs');
var csv = require('jquery-csv');
const csvFolder = './Spreadsheets';
var weapons = [];
var files = [`${csvFolder}/d2_all_weapons.csv`, `${csvFolder}/d2_pve_auto_rifle_rolls.csv`]

/*fs.readFile(`${csvFolder}/d2_all_weapons.csv`, 'UTF-8', (err, data) => {
    if (err) {
        console.log(err);
        return;
    }

    csv.toObjects(data, {}, (err, dat) => {
        if (err) {
            console.log(err);
            return;
        }

        for (var i = 0; i < dat.length; i++) {
            var filename = dat[i].WEAPON.replace(/w\//g, 'with').replace(/ /g, '_');
            weapons.push(dat[i]);
            fs.writeFile(`JSON/${filename}.json`, JSON.stringify(dat[i], null, 10) + '\n', (err) => {
                if (err) {
                    console.log(err);
                }
            });
        }
        
    });
});*/

files.forEach(file => {
    console.log(file);
    try {
        fs.readFile(`${file}`, 'UTF-8', (err, data) => {
            if (err) {
                console.log(err);
                return;
            }
        
            csv.toObjects(data, {}, (err, dat) => {
                if (err) {
                    console.log(err);
                    return;
                }

                if (file == `${csvFolder}/d2_all_weapons.csv`) {
                    for (var i = 0; i < dat.length; i++) {
                        var filename = dat[i].WEAPON.replace(/w\//g, 'with').replace(/ /g, '_');
                        weapons.push(dat[i]);
                        /*fs.writeFile(`JSON/${filename}.json`, JSON.stringify(dat[i], null, 10) + '\n', (err) => {
                            if (err) {
                                console.log(err);
                            }
                        });*/
                    }
                    console.log(weapons);
                } else {
                    for (var i = 0; i < dat.length; i++) {
                        Object.keys(dat[i]).forEach( (key, index) => {
                            console.log(weapons);
                            var curWeapon = weapons.filter(x => x.WEAPON == dat[i].WEAPON)[0];
                            var index = weapons.findIndex(x => x.WEAPON == dat[i].WEAPON);

                            if (!curWeapon.hasOwnProperty(key)) {
                                weapons[i].push(curWeapon[index]);
                                console.log(weapons[i]);
                            }
                        })
                    }
                }
            });
                
        })
    } catch (err) {
        console.log('try: ' + err);
    }
});

