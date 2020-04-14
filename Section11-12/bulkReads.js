const AWS = require('aws-sdk');

const dynamoDb = new AWS.DynamoDB.DocumentClient({ region: 'us-east-1' });
// const dynamoDb = new AWS.DynamoDB.DocumentClient({ region: 'us-east-1' });

setInterval(() => {
    var results = [];
    var pages = 0;

    let params = {
        TableName: 'global_udemy_notes',
        Limit: 30,
    };
    dynamoDb.scan(params, function scanUntilDone(err, data) {
        if (err) {
            console.log(err, err.stack);
        } else {
            if (data.LastEvaluatedKey) {
                params.ExclusiveStartKey = data.LastEvaluatedKey;
                pages++;
                results = [...results, ...data.Items];
                dynamoDb.scan(params, scanUntilDone);
            } else {
                // all results processed. done
                pages++;
                results = [...results, ...data.Items];
                console.log('Pages:', pages);
                console.log('Count', results.length);
            }
        }
    });
}, 300);
