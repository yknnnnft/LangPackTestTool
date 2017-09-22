var langPackUtil = require('./langPackUtil.js');

var cfg = require('./cfg.json'),
    CONSTANTS = require('./constants.json'),
    tblCfg = require('./table.json');

_test();
exports.exec = function() {
    
};

function _test() {
    // let testString = 'cpny_litrinfo_ins_cn.dat';
    // let reg = new RegExp(CONSTANTS.TGT_DAT_REG);
    // console.log(`${testString}, ${reg}`);
    // console.log(reg.exec(testString));

    counterController();
}

function counterController() {
    let regTgtDat = new RegExp(CONSTANTS.TGT_DAT_REG);
    let arrPTFPaths = langPackUtil.mkSubFullPath(cfg.langpack);
    console.log(arrPTFPaths);
    return langPackUtil.getReadDirPromise(arrPTFPaths[0]).then(arrFiles => {
        let arrTgtFiles = arrFiles.filter(filename => regTgtDat.test(filename));
        console.log(arrTgtFiles);
        return arrTgtFiles;
    }).then(arrTgtFiles => {
        let pCountRecords = arrTgtFiles.map(file => countSingleFile());
        return Promise.all(arrTgtFiles).then(vals => vals.map(
                                            val =>  ge))
    });

}

function _readDirs(arrDirs) {
    if (arrDirs.length) {
        return _readDir(0, arrDirs);
    }
}

function _readDir(dirIndex, arrDirs) {
    let currIndex = dirIndex;
    return langPackUtil.getReadDirPromise(
                            arrDirs[currIndex++]).then(arrFileList => {
        if (currIndex < arrFileList.length) {
            return readCounts(currIndex, arrFiles);
        }
        else {
            return Promise.reject();
        }
    });
}

function countFiles(fileIndex, arrFiles) {
    return countSingleFile(arrFiles[fileIndex]);

}

function countSingleFile(file) {
    return langPackUtil.getReadFilePromise(file).then(data => {
        return _dataToTable(data, CONSTANTS.CRLF).length - 1;
    });

}

function _dataToTable(dataString, splitString) {
    return dataString.split(splitString);
}

