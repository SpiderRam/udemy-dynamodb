const AWS = require("aws-sdk");

const faker = require('faker');
const moment = require('moment');

const docClient_us = new AWS.DynamoDB.DocumentClient({ region: 'us-east-1' });

setInterval(() => {
    let params = {
        TableName: 'global_udemy_notes',
        Item: {}
    };
    generateNotesItem((item) => {
        params.Item = item;
        docClient_us.put(params, (err, data) => {
            if (err) {
                console.log('Error in US PUT', err);
            } else {
                console.log('Data:', data);
            }
        });
    });
}, 300);

function generateNotesItem(callback) {
    callback({
        user_id: faker.random.uuid(),
        timestamp: moment().unix(),
        cat: faker.random.word(),
        title: faker.company.catchPhrase(),
        content: faker.hacker.phrase(),
        note_id: faker.random.uuid(),
        user_name: faker.internet.userName,
        expires: moment().unix() + 600
    });
}