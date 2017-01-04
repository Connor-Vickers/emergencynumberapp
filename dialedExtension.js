'use strict';
console.log('Loading event');
var AWS = require('aws-sdk');
var dynamodb = new AWS.DynamoDB({apiVersion: '2012-08-10'});
exports.handler = (event, context, callback) => {
    
    var body = event["body-json"];
    var parameters = JSON.parse('{"' + decodeURI(body).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g,'":"').replace(/%2B/g,'+') + '"}');
    console.log(parameters.Digits);
    

    var getParams = {
        Key: { extension: {N: parameters.Digits} },
        TableName: 'getThrough'
    };
    
    var putParams = {
        Item: { extension: {N: parameters.Digits}, number: {S: parameters.From} },
        TableName: 'getThrough'
    };
    console.log("getParams:", getParams);
    dynamodb.getItem(getParams, function(err,data){
        if (err || data.Item === undefined){
                callback(null, "<Response><Say>I'm sorry that is an invalid extension please check it and try again</Say></Response>");
        }else{
            console.log("got:", JSON.stringify(data.Item));
            if (data.Item.number === undefined){
                dynamodb.putItem(putParams, function(err,data){
                    callback(null, "<Response><Say>your get through number is all setup, thank you</Say></Response>");
                });
            }else{
                callback(null, "<Response><Dial timeLimit='600' callerId='"+ parameters.To + "'>" + data.Item.number.S + "</Dial></Response>");
            }
        }
    });
};