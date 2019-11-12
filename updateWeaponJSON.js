var jsdom = require('jsdom');
const { JSDOM } = jsdom;
const { window } = new JSDOM();
const { document } = (new JSDOM('')).window;
global.document = document;
var fs = require('fs');
var csv = require('jquery-csv');
const csvFolder = './Spreadsheets/csv';

fs.readdir(csvFolder, (err, files) => {
    files.forEach(file => {
        try {
            fs.readFile(`${csvFolder}/${file}`, 'UTF-8', (err, dat) => {
                if (err) {
                    console.log(err);
                    console.log('foreach');
                    return;
                }
                csv.toObjects(dat, {}, function (err, data) {
                    if (err) { 
                        console.log(err);
                        return; 
                    }
            
                    var objs = [];
                    //var objStream = fs.createWriteStream(`${csvFolder}/JSON/${file.slice(0, -4)}_jsons.txt`, {'flags': 'a'});
                    for (var i = 0; i < data.length; i++) {
                        //objs.push(data[i]);
                        if (i != data.length - 1) {
                            if (data[i+1].Name == data[i].Name) {
                                data[i].Mode = 'PvE';
                                data[i+1].Mode = 'PvP';
                            }
                            if (!data[i].hasOwnProperty('Mode')) {
                                data[i].Mode = 'PvE';
                            }
                        }
                        //objStream.write(JSON.stringify(data[i], null, 6) + '\n');
                        fs.writeFile(`${csvFolder}/JSON/${data[i].Name}_${data[i].Mode}.json`, JSON.stringify(data[i], null, 6) + '\n', (err) => {
                            if (err) {
                                throw err;
                            }
                        });
                    }
                    //objStream.end();
                });
            });
        } catch (err) {
            console.log(err);
        }
        
    });
});


