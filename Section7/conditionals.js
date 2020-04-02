const AWS = require("aws-sdk");
AWS.config.update({ region: "us-east-1" });

const docClient = new AWS.DynamoDB.DocumentClient();

const params = {
    TableName: "udemy_ddb_notes_sdk",
    Item: {
        user_id: "Cleary",
        timestamp: 1585766765,
        title: "Ramona is Making Trouble",
        content: "...again."
    },
    ConditionExpression: '#t <> :t',
    ExpressionAttributeNames: {
        '#t': 'timestamp'
    },
    ExpressionAttributeValues: {
        ':t': 1585766765
    }
}

docClient.put(params, (err, data) => {
    if(err) {
        console.log(err);
    } else {
        console.log(data);
    }
});