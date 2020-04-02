const AWS = require("aws-sdk");
AWS.config.update({ region: "us-east-1" });

const docClient = new AWS.DynamoDB.DocumentClient();

const putParams = {
  TableName: "udemy_ddb_notes_sdk",
  Item: {
    user_id: "bb",
    timestamp: 1585752527,
    title: "Title (Updated)",
    content: "Content (Updated)"
  }
};

const updateParams = {
  TableName: "udemy_ddb_notes_sdk",
  Key: {
    user_id: "bb",
    timestamp: 1585752064
  },
  UpdateExpression: "set #t = :t",
  ExpressionAttributeNames: {
    "#t": "title"
  },
  ExpressionAttributeValues: {
    ":t": "All New Title"
  }
};

const deleteParams = {
  TableName: "udemy_ddb_notes_sdk",
  Key: {
    user_id: "bb",
    timestamp: 1585752064
  }
};

const batchWriteParams = {
  RequestItems: {
    udemy_ddb_notes_sdk: [
      {
        DeleteRequest: {
          Key: {
            user_id: "bb",
            timestamp: 1585752527
          }
        }
      },
      {
        PutRequest: {
          Item: {
            user_id: "Seuss",
            timestamp: 1585765154,
            title: "Cooking with Oobleck",
            content: "Yeah... don't do that."
          }
        }
      },
      {
        PutRequest: {
          Item: {
            user_id: "DePaola",
            timestamp: 1585765325,
            title: "Helga 2020",
            content: "Vote smart troll bitch, since we can't have Bernie."
          }
        }
      }
    ]
  }
};

// Getting an empty object as the response means it worked

docClient.batchWrite(batchWriteParams, (err, data) => {
  if (err) {
    console.log(err);
  } else {
    console.log(data);
  }
});

// docClient.delete(deleteParams, (err, data) => {
//     if(err) {
//         console.log(err);
//     } else {
//         console.log(data);
//     }
// });

// docClient.update(updateParams, (err, data) => {
//     if(err) {
//         console.log(err);
//     } else {
//         console.log(data);
//     }
// });

// docClient.put(putParams, (err, data) => {
//     if(err) {
//         console.log(err);
//     } else {
//         console.log(data);
//     }
// });
