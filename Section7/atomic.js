const AWS = require("aws-sdk");
AWS.config.update({ region: "us-east-1" });

const docClient = new AWS.DynamoDB.DocumentClient();

const params = {
    TableName: "udemy_ddb_notes_sdk",
    Key: {
        user_id: "ABC",
        timestamp: 1
    },
    UpdateExpression: 'set #v = #v + :incr',
    ExpressionAttributeNames: {
        "#v": "views"
    },
    ExpressionAttributeValues: {
        ":incr": 1
    }
}

docClient.update(params, (err, data) => {
    if(err) {
        console.log(err);
    } else {
        console.log(data);
    }
});