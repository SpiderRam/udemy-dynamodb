const AWS = require('aws-sdk');

const faker = require('faker');
const moment = require('moment');
const pako = require('pako');

const docClient = new AWS.DynamoDB.DocumentClient({ region: 'us-east-1' });

generateNotesItem((item) => {
    console.log('Uncompressed item:', item);
    putNotesItem(item, (err, data) => {
        if (err) {
            console.log(err);
        } else {
            console.log('Compressed Item:', item);
            getNotesItem(
                {
                    user_id: item.user_id,
                    timestamp: item.timestamp,
                },
                (err, data) => {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log('Uncompressed Read:', data.Item);
                    }
                }
            );
        }
    });
});

function putNotesItem(item, callback) {
    if (item.content.length > 35) {
        let content_b = pako.gzip(item.content, { to: 'string' });
        item.content_b = content_b;
        item.content = undefined;
        docClient.put(
            {
                TableName: 'global_udemy_notes',
                Item: item,
            },
            callback
        );
    } else {
        docClient.put(
            {
                TableName: 'global_udemy_notes',
                Item: item,
            },
            callback
        );
    }
}

function getNotesItem(key, callback) {
    docClient.get(
        {
            TableName: 'global_udemy_notes',
            Key: key,
        },
        (err, data) => {
            if (err) {
                callback(err);
            } else {
                if (data.Item.content) {
                    callback(null, data);
                } else {
                    try {
                        const uncompressed = pako.ungzip(data.Item.content_b, {
                            to: 'string',
                        });
                        data.Item.content = uncompressed;
                        data.Item.content_b = undefined;
                        callback(null, data);
                    } catch (error) {
                        console.log(error);
                    }
                }
            }
        }
    );
}

function generateNotesItem(callback) {
    callback({
        user_id: faker.random.uuid(),
        timestamp: moment().unix(),
        cat: faker.random.word(),
        title: faker.company.catchPhrase(),
        content: faker.hacker.phrase(),
        note_id: faker.random.uuid(),
        user_name: faker.internet.userName(),
        expires: moment().unix() + 600,
    });
}
