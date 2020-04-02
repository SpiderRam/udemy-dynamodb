const AWS = require('aws-sdk');
AWS.config.update({ region: 'us-east-1'});

const dynamodb = new AWS.DynamoDB();
const describeTableParams = {
    // TableName: 'udemy_ddb_notes'
    TableName: 'udemy_ddb_notes_sdk'
};

const createTableParams = {
    TableName: 'udemy_ddb_notes_sdk',
    AttributeDefinitions: [
        {
            AttributeName: "user_id",
            AttributeType: "S"
        },
        {
            AttributeName: "timestamp",
            AttributeType: "N"
        }
    ],
    KeySchema: [
        {
            AttributeName: "user_id",
            KeyType: "HASH"
        },
        {
            AttributeName: "timestamp",
            KeyType: "RANGE"
        }
    ],
    ProvisionedThroughput: {
        ReadCapacityUnits: 1,
        WriteCapacityUnits: 1
    }
};

const updateTableParams = {
    TableName: 'udemy_ddb_notes_sdk',
    ProvisionedThroughput: {
        ReadCapacityUnits: 2,
        WriteCapacityUnits: 1
    }
};

const deleteTableParams = {
    TableName: 'udemy_ddb_notes_sdk'
};

// dynamodb.deleteTable(deleteTableParams, function(err, data){
//     if(err) {
//         console.log('Error:', err);
//     } else {
//         console.log(JSON.stringify(data, null, 2));
//     }
// });

// dynamodb.updateTable(updateTableParams, function(err, data){
//     if(err) {
//         console.log('Error:', err);
//     } else {
//         console.log(JSON.stringify(data, null, 2));
//     }
// });

// dynamodb.createTable(createTableParams, function(err, data){
//     if(err) {
//         console.log('Error:', err);
//     } else {
//         console.log(JSON.stringify(data, null, 2));
//     }
// });

// dynamodb.describeTable(describeTableParams, function(err, data){
//     if(err) {
//         console.log('Error:', err);
//     } else {
//         console.log(JSON.stringify(data, null, 2));
//     }
// });

dynamodb.listTables({}, function(err, data){
    if(err) {
        console.log('Error:', err);
    } else {
        console.log(JSON.stringify(data, null, 2));
    }
});
