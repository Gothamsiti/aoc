'use strict';
const fs = require("fs");
class csvRouterParser {
    getArray (req, res) {
        var csv = fs.readFileSync('./static/redirect301.csv','utf8');
        // console.log(csv);
        csv = csv.replace("\r","");
        var lines= csv.split("\n");
        var arr = []
        for(var i in lines){
            var col = '';
            var obj = {}
            col = lines[i].split(";");
            obj.from = col[0];
            obj.to = col[1].replace("\r","");;
            obj.statusCode = 301
            arr.push(obj);
        }
        return arr;
    } 
}
module.exports = csvRouterParser;