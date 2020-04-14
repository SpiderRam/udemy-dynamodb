const AWS = require("aws-sdk");

const docClient_us = new AWS.DynamoDB.DocumentClient({ region: 'us-east-1' });
const docClient_eu = new AWS.DynamoDB.DocumentClient({region: 'eu-central-1'}); 

docClient_us.put({
    TableName: 'global_udemy_notes',
    Item: {
        user_id: '111',
        timestamp: 1586870591,
        title: 'US Note from SDK',
        content: 'Remember to set the region correctly when using the sdk.'
    }
}, (err, data) => {
    if (err) {
        console.log('Error in docClient_us PUT', err);
    } else {
        console.log(`PUT successful in ${docClient_us.options.region}:`, data);
        setTimeout(() => {
            docClient_eu.get({
                TableName: 'global_udemy_notes',
                Key: {
                    user_id: '111',
                    timestamp: 1586870591
                }
            }, (err, data) => {
                if(err) {
                    console.log('Error in docClient_eu GET', err);
                } else {
                    console.log('Getting the item from', docClient_eu.options.region);
                    console.log(data);
                }
            });
        }, 1000);
    }
});