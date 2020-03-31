# AWS DynamoDB - The Complete Guide 
### SECTIONS 1-6:  Setting up your environment and using the AWS CLI

> Preparing the local environment
1. Sign up for a free tier AWS Account if you don't already have one
2. Install [AWS-CLI (V2)](https://docs.aws.amazon.com/cli/latest/userguide/install-cliv2-mac.html) -- this is not super easy on a Mac, unless you opt to install for all users. 
3. Create IAM role
    - Course has instructions for setting up a limited IAM role for this course only, or...
    - If you don't already have an admin IAM role and you'd rather just do this on your main account, do as instructed [here](https://docs.aws.amazon.com/IAM/latest/UserGuide/getting-started_create-admin-group.html)
4. Add access key, secret access key, and default region
    - If you followed the course instructions but you still can't connect to the DB, run `aws sts get-caller-identity`
    - If that indicates that you don't have the credentials in place, try `aws configure`, as described [here](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-configure.html#cli-quick-configuration)

> Commands used in Section 6 (AWS-CLI)
- See table details:  `aws dynamodb describe-table --table-name udemy_ddb_notes`
- Create a new table:  `aws dynamodb create-table --table-name udemy_ddb_notes_cliTest --attribute-definitions AttributeName=user_id,AttributeType=S AttributeName=timestamp,AttributeType=N --key-schema AttributeName=user_id,KeyType=HASH AttributeName=timestamp,KeyType=RANGE --provisioned-throughput ReadCapacityUnits=1,WriteCapacityUnits=1`
- Verify new table details:  `aws dynamodb describe-table --table-name udemy_ddb_notes_cliTest`
- See list of tables (equivalent to `node list-tables`):  `aws dynamodb list-tables`
- Delete new table (added back afterwards):  `aws dynamodb delete-table --table-name udemy_ddb_notes_cliTest`
- Add a new item:  `aws dynamodb put-item --table-name udemy_ddb_notes_cliTest --item file://item.json`
- Update an existing item:  `aws dynamodb update-item --table-name udemy_ddb_notes_cliTest --key file://key.json --update-expression "SET #t = :t" --expression-attribute-names file://attrNames.json --expression-attribute-values file://attrValues.json`
- Delete an existing item:  `aws dynamodb delete-item --table-name udemy_ddb_notes_cliTest --key file://key.json`
- Perform multiple operations at once:  `aws dynamodb batch-write-item --request-items file://items.json`
- Get an item from the table: `aws dynamodb get-item --table-name udemy_ddb_notes_cliTest --key file://read-key.json`
- Get an item using a filter: <sup style="color: red">1</sup>  `aws dynamodb query --table-name udemy_ddb_notes_cliTest --key-condition-expression "user_id = :uid AND #t > :t" --expression-attribute-value file://expression-attribute-values.json --expression-attribute-name file://expression-attribute-names.json`
- Get an item using more than one filter: `aws dynamodb query --table-name udemy_ddb_notes_cliTest --key-condition-expression "user_id = :uid AND #t > :t" --expression-attribute-value file://expression-attribute-values.json --expression-attribute-name file://expression-attribute-names.json --filter-expression "cat = :cat"`
- Add the --return-consumed-capacity flag: <sup style="color: red">2</sup> `aws dynamodb query --table-name udemy_ddb_notes_cliTest --key-condition-expression "user_id = :uid AND #t > :t" --expression-attribute-value file://expression-attribute-values.json --expression-attribute-name file://expression-attribute-names.json --filter-expression "cat = :cat" --return-consumed-capacity INDEXES --consistent-read --no-scan-index-forward`
- Get multiple items (must specify the primary key): `aws dynamodb batch-get-item --request-items file://getBatchItems.json`
- Scan the table rather than query it, and format the response as a table just because: <sup style="color: red">3</sup> `aws dynamodb scan --table-name udemy_ddb_notes_cliTest --output table`
- Scan the table and add a filter expression: <sup style="color: red">4</sup> `aws dynamodb scan --table-name udemy_ddb_notes_cliTest --filter-expression "username = :uname" --expression-attribute-values file://uname.json --output table`

<span style="color: yellow;">NOTES:</span> 

<span style="color: yellow;">*</span> For batch-write-item, the table name must be specified in the items.json file, as the key set equal to the array of operation to be performed. 

<span style="color: yellow;">*</span>  The instructor does point out that this is more elegantly done with the AWS SDK in the next section. 

<span style="color: yellow;">*</span>  A full list of DynamoDB AWS-CLI commands can be found [here](https://docs.aws.amazon.com/cli/latest/reference/dynamodb/index.html). 

<span style="color: red;">1</span> If you see an error such as 'Attribute name is a reserved keyword; reserved keyword: timestamp,' you need to employ the kind of syntax used here, #t and :t with the corresponding file(s).

<span style="color: yellow;">*</span>  Count vs. Scanned Count
  - Scanned count is the number of items examined based on the indexes specified by the query conditions (i.e. user_id and timestamp).
  - Count is the number of items ultimately returned, after the filters have been applied (i.e. cat = todo).

<span style="color: red;">2</span> `--return-consumed-capacity` 
- returns the RCUs or WCUs used, and can take one of three values:
    - INDEXES: overall consumed capacity for the table as well as indexes if any
    - TOTAL: only the consumed capacity for the table
    - NONE
This will return an object like this one at the end of the query:
```bash
"ConsumedCapacity": {
    "TableName": "udemy_ddb_notes_cliTest",
    "CapacityUnits": 0.5,
    "Table": {
        "CapacityUnits": 0.5
    }
}
```
- The `--consistent-read` flag tells the cli to run the command with strong consistency, which doubles the consumed capacity
- You can specify what order the results are returned in by using one of two flags:
  - `--scan-index-forward` returns results in ascending order by sort key (default)
  - `--no-scan-index-forward` returns results in descending order by sort key

<span style="color: red;">3</span> Scanning instead of querying will look at every index in the table, and not use any resources.  The `--output` flag accepts any of four choices:
  - json (default)
  - text
  - table
  - yaml

| ConsumedCapacity | Count | ScannedCount|
| :-------: | :-------: | :-------: | 
| None | 11 | 11 |

<span style="color: red;">4</span> Scanning with a filter expression will still look at every index in the table, and not use any resources, but then only return the results which pass the filter.

| ConsumedCapacity | Count | ScannedCount|
| :-------: | :-------: | :-------: | 
| None | 3 | 11 |
