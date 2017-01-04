'use strict';
console.log('Loading event');
var AWS = require('aws-sdk');
var dynamodb = new AWS.DynamoDB({apiVersion: '2012-08-10'});

var putParams;
var number;

function random10DigitNumber(){
    var n = Math.random()*10000000000;
    if(n < 1000000000){
    	n = n + 1000000000;
    }
    n = n.toFixed(0);
    n = n.toString();
    putParams = {
        Item: { extension: {N: n} },
        TableName: 'getThrough'
    };
    number = n;
}

exports.handler = function(event, context, callback) {
  random10DigitNumber();
  dynamodb.putItem(putParams, function(err, data) { 
      console.log(err, data); 
  });
  callback(null, number);  // SUCCESS with message
};
