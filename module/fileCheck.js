var fs = require('fs'),
    jschardet = require('jschardet'),
    langPackUtil = require('./langPackUtil.js');

var jsonCfg = require('./cfg.json'), 
    jsonTable = require('./table.json'),
    CONSTANTS = require('./constants.json');

exports.exec = function() {
    let jsonLangPackCfg = jsonCfg.langpack,
        sParFolder = jsonLangPackCfg.folder,
        arrSubFolder = jsonLangPackCfg.subfolder;
    let arrSubPromise = arrSubFolder.map((val, index, arr) => {
        let fileFullPath = `${sParFolder}\\${val}`;
        return langPackUtil.getReadDirPromise(fileFullPath);
    });
    console.log(arrSubPromise);
    return Promise.all(arrSubPromise).then(values => {
        console.log('Promise all resolved');
        return values.reduce((accVal, curVal, curIndex, arr) => {
            return accVal.concat(curVal);
        });
    }).then(allFiles => {
        let arrEncodeCheckPromises = allFiles.filter(
                                        filename => filename.endsWith(CONSTANTS.DAT_EXTENSION)).map(
                                        fileFullPath => encodeCheck(fileFullPath));
        let regDelSql = new RegExp(CONSTANTS.DEL_SQL_EXTENSION_REG);
        let arrHalfWidthCheckPromises = allFiles.filter(
                                        filename => regDelSql.test(filename)).map(
                                        fileFullPath => halfWidthCheck(fileFullPath));
        let arrCRLFCheckPromises = allFiles.filter(
                                        filename => filename.endsWith(CONSTANTS.DAT_EXTENSION)).map(
                                        fileFullPath => crlfCheck(fileFullPath));
        return Promise.all(arrEncodeCheckPromises
                            .concat(arrHalfWidthCheckPromises)
                            .concat(arrCRLFCheckPromises)).then(arrVals => {
            console.log(arrVals);
            return 0;
        });
    });
}

function encodeCheck(singleFile) {
    console.log(singleFile);
    return langPackUtil.getReadFilePromise(singleFile).then(data => {
        let result = jschardet.detect(data),
            filename = singleFile;
        result.checkType = CONSTANTS.CHECKTYPE.ENCODING_CHECK;
        result.result = _isUTFCheck(result.encoding);
        result.filename = filename;
        return result;
    });
}

function _isUTFCheck(encode) {
    return encode == 'UTF-8' || encode == 'ascii' || encode == 'windows-1252';
}

function halfWidthCheck(singleFile) {
    console.log(`half width check on: ${singleFile}`);
    return langPackUtil.getReadFilePromise(singleFile).then(data => {
        console.log(`half width check: ${CONSTANTS.FULL_WIDTH_REG}`);
        let result = {};
        let regFullWidth = new RegExp(CONSTANTS.FULL_WIDTH_REG);
        result.checkType = CONSTANTS.CHECKTYPE.HALF_WIDTH_CHECK;
        result.result =  !regFullWidth.test(data);
        if (!result.result) {
            result.fullWidthContext = regFullWidth.exec(data);
        }
        result.filename = singleFile;
        console.log(`test result: ${result}`);
        return result;
    });
}

function crlfCheck(singleFile) {
    console.log(`crlf Check starts on: ${singleFile}`);
    return langPackUtil.getReadFilePromise(singleFile).then(data => {
        let result = {};
        result.checkType = CONSTANTS.CHECKTYPE.CRLF_CHECK;
        result.filename = singleFile;
        result.result = _isCRLF(data);
        console.log(`CRLF check ends: ${result}`)
        return result;
    });
}

// TODO RegExp in javascript is not able to lookbehind
// need to check for LF?
function _isCRLF(data) {
    let regCR = new RegExp(CONSTANTS.CR_REG);
    return !regCR.test(data);
    // let regLF = new RegExp(CONSTANTS.LF_REG);
    // return regLF.test(data);
    // let sData = data.toString();
    // let countCRLF = sData.split(CONSTANTS.CRLF).length,
    //     countCR = sData.split(CONSTANTS.CR).length,
    //     countLF = sData.split(CONSTANTS.LF).length;
    // let result = countCRLF == countCR && countCRLF == countLF;
    // if (!result) {
    //     console.log(`${countCRLF} & ${countCR} & ${countLF}`);
    // }
    // return countCRLF == countCR && countCRLF == countLF;
}


