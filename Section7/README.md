# AWS DynamoDB - The Complete Guide 
### SECTION 7:  Using the AWS SDK

\>> `npm i aws-sdk`

#### Course content:
- 7.42 -> table-ops.js
- 7.43 -> write-ops.js
- 7.44 -> conditionals.js
- 7.45 -> atomic.js
- 7.46 -> read-ops.js
- 7.47 -> paginate.js **NOTE** The code presented in the course is not currently working.  It is an older course and it relies on a couple of third party packages; the problem could be any of several possibilities.  The 'finished' code attached to the course had the same problem, although it was supposedly updated 9 months ago.  Will revisit at the end of the course to try a different approach.

#### AWS.DynamoDB.DocumentClient
> Simplifies working with DDB items by abstracting details

- No need to specify types (string, number, etc.)

#### Notes
- In section 6, using the API, data types had to be specified (string, number, etc.).  But numbers had to be passed as strings.  When using the sdk, you do not have to declare types, but numbers should be numbers, and so on.
- Conditional writes:
  - are idempotent, meaning that if we make the same conditional request multiple times, only the first successful one will have any effect
  - return ConditionalCheckFailedException if condition fails
  - do not return the consumed capacity
  - but they do consume WCUs.
- The Atomic Counters example uses the UpdateItem API
  - It increments/decrements atomically, which simply means it is altering the value of one attribute without affecting others
  - This operation is not idempotent: it changes the attribute value no matter how many times the same call is repeated
  - All requests are applied in order
  - This kind of operation would not be acceptable in applications where accuracy was important
- The maximum amount of data a single scan or query read operation can return is 1 MB.  It can be set lower, but not higher.  For operations which need to return more than 1 MB, AWS offers paginated reads.
  - In this case, the response would contain an additional parameter:  `LastEvaluatedKey`
  - This is the set of index attributes of the next item up to which the response was returned
  - This can be used in a subsequent query or scan to retrieve the next page of data, using `ExclusiveStartKey`
  - If there is no `LastEvaluatedKey` parameter in the response, then you have reached the last page.

#### Docs

- [DynamoDB](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB.html)
- [DynamoDB.DocumentClient](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB/DocumentClient.html)

- [npm async](https://www.npmjs.com/package/async)
- [npm underscore](https://www.npmjs.com/package/underscore)