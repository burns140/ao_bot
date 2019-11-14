var jsdom = require('jsdom');
const { JSDOM } = jsdom;
const { window } = new JSDOM();
const { document } = (new JSDOM('')).window;
global.document = document;
var fs = require('fs');
var csv = require('jquery-csv');
const csvFolder = './Spreadsheets';

fs.readFile(`${csvFolder}/d2_all_weapons.csv`, 'UTF-8', (err, data) => {
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
            console.log(dat[i]);
            fs.writeFile(`JSON/${filename}.json`, JSON.stringify(dat[i], null, 10) + '\n', (err) => {
                if (err) {
                    console.log(err);
                }
            });
        }
        
    });
});