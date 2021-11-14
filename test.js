const axios = require("axios");
const XLSX = require("xlsx");
const { default: async } = require("async");

var filePath = "./mass_upload_locations.xlsx";

module.exports.index = async function () {
    var workbook = XLSX.readFile(filePath);
    var sheetNameList = workbook.SheetNames;
    var data = XLSX.utils.sheet_to_json(workbook.Sheets[sheetNameList[0]]);
    console.log(data);
}

this.index();