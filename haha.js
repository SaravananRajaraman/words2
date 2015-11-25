/**
 * Created by HP on 11/25/2015.
 */

var request = require('request'); //call in side the node js
var interval = 4320000;
//var interval = 3000;
var index = 0;
var haha = function(){
    setInterval(function(){
    request("http://chat3110.herokuapp.com/",function (error, response, body) {
        if (!error && response.statusCode == 200) {
            console.log("URL Ping..... "+ ++index + " On "+ new Date());
        }
    });
},interval)}();

module.exports = haha;