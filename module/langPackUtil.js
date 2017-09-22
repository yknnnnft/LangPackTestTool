var fs = require('fs');
var jschardet = require('jschardet');

// var jsonCfg = require('./cfg.json'), 
//     jsonTable = require('./table.json'),
//     CONSTANTS = require('./constants.json');

exports.getReadDirPromise = function(path){
    console.log(`reading dir starts: ${path}`);
    return new Promise(function(resolve, reject) {
        fs.readdir(path, function(err, files) {
            if (err) {
                console.log(`reading dir failed`);
                return reject(err);
            }
            console.log(`reading dir succeeded: ${files}`);
            return resolve(files.map(filename => `${path}\\${filename}`));
        });
    });
}

exports.getReadFilePromise = function(filePath) {
    console.log(`reading file: ${filePath}`);
    return new Promise(function(resolve, reject) {
        fs.readFile(filePath, function(err, data) {
            if (err) {
                console.log(`reading file failed: ${filePath}`);
                return reject(err);
            }
            console.log(`reading file succeded`);
            return resolve(data);
        });
    });
};

exports.mkSubFullPath = function(cfgKey) {
    console.log(cfgKey);
    return cfgKey.subfolder.map(subFolder => `${cfgKey.folder}\\${subFolder}`);
};
