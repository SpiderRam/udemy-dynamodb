# AWS DynamoDB - The Complete Guide 
## SECTION 8:  DynamoDB Architecture

**8.49** and **8.54**:  Not going to lie -- there is a lot of math involved in calculating partitions and indexes (WCUs, RCUs, GBs, etc.).  I did not try hard to understand most of it.  If I ever pursue the IAC/DevOps side of things I will pay more attention, but this is a lot for an intro course, and my weak foundation in math and computer science would need shoring up in any case.  

### Keys & Partitions (50-51)

- One DynamoDb partition can deliver up to 1000 WCUS or 3000 RCUs and up to 10GB of storage.
- DynamoDB keys can be simple or composite.
  - A simple key includes only the partition key (mostly analogous to a primary key in other DBs)
  - A composite key includes both a partition key and a sort key.
  - When a simple key is used, the partition key can occur only once in the table.
  - When a composite key is used, the partition key can occur multiple times, but each combination with the sort key must be unique, and can only occur once in the table.
- Keys can only be of type string, number, or binary (Scalar Types)
- To keep costs low and speed high, it is important to use as many unique partition keys as possible -- in other words, store many small items in the database, instead of a few items with a lot of attributes.
- It is good practice to keep frequently accessed and infrequently accessed data in separate tables.
- Query operations are preferable to scan operations for efficiency, because scan operations have to check every item
- You must specify the complete partition key, not a partial one
- Direct queries are more efficient than filters, so the well-though-out architecture of your sort keys is critical
  - Numerical values are often best for sort keys, but it really depends on your individual app.
  - Shorter (yet intuitive) attribute names are preferable to longer ones

| Local Secondary Indexes | Global Secondary Indexes |
| :------- | :------- |
| When the application needs the same partition key as the table | When the application can have either the same partition key as the table or a different one|
|When you need to avoid additional costs|When the app needs finer throughput control|
|When the app needs strongly consistent reads|When the app only needs eventually consistent reads|

### Design Patterns (8.52)

Since DynamoDB does not have built-in support for inter-table relationships, foreign keys, etc., we can implement these relationships in other ways.
#### One-to-One Relationships
##### * NOTE: Simple keys on both entities
> Table 1

|student_id (pk)|name|email|SSN (gsi)|
| :------- | :------- | :------- | :------- |
|1001|John|john@example.com|234|
|1002|Mary|mary@example.com|345|
|1003|Bill|bill@example.com|888|

> Table 2

|student_id (pk)|grade|
| :------- | :------- |
|1001| A|
|1002|A+|
|1003|B|

> Table 3

|dept_id (pk)|student_id (gsi)|grade|
| :------- | :------- | :------- |
|D1|1001| A|
|D2|1002|A+|
|D3|1003|B|

1. Within a table:
   - create a global secondary index with an alternate partition key
   - if you make the SSN the gsi, then you have a 1:1 relationship between the table partitions and the gsi, and you can get an item using either the student_id (pk) or SSN (gsi).

2. Between two tables:
   - You can make the primary key the same for each student on both tables 1 & 2
   - Or, you can make the student_id a gsi on table 3 to create a relationship to the student_id on table 1
   - **NOTE:** these are not strict foreign key relationships as with a SQL or other relational database, so you must maintain them yourself programmatically.

#### One-to-Many Relationships
##### * NOTE: Simple key on one entity, and composite key on the other

> Table 4

|student_id (pk)|subject (sk)|
| :------- | :------- |
|1001| Math|
|1001|Physics|
|1003|Economics|

> Table 5

|subject_id (pk)|student_id (sk AND gsi)|subject|
| :------- | :------- | :------- |
|S001|1001| Math|
|S002|1001|Physics|
|S003|1003|Economics|

> Table 6

|student_id (pk)|name|email|subjects|
| :------- | :------- | :------- | :------- |
|1001|John|john@example.com|{Math, Physics}|
|1002|Mary|mary@example.com|{Economics, Civics}|
|1003|Bill|bill@example.com|{Computer Science, Math}|

1. To relate students in table 1 to their items in table 4, the primary key is the same, and the sort key allows you to find all subjects relevant to the student
2. To relate students in table 1 to their items in table 5, you would query table 5 using the student_id gsi
3. Another approach, seen on table 6, is to use the string set type to store all of a given student's subjects as a single attribute

**NOTE:** 

Sort Keys/Composite Keys are used for:
- Large item sizes
- If querying multiple items within a partition key is required

Set Types are used for:
- Small item sizes
- If querying individual item attributes in Sets is not needed

#### Many-to-Many Relationships
##### * NOTE: Composite keys on both entities

> Table 7

|student_id|subject_id |subject|
| :------- | :------- | :------- |
|1001|S001| Math|
|1001|S002|Physics|
|1002|S003|Economics|
|1003|S001|Math|

The 'easiest' way to create a many to many relationship is using a table and gsi with partition and sort attributes switched
- The student_id is both the Primary Partition Key AND the GSI Sort Key
- The subject_id is both the Primary Sort Key AND the GSI Partition Key

#### Hierarchical Data Structures

1. Table Items

> Table 8

|curriculum_id (pk)|type (sk)|attributes...|
| :------- | :------- | :---------- |
|Medical| Radiology||
|Medical| Dentistry||
|Medical| Orthopedics||
|Engineering|Computer Science||
|Engineering|Electronics||
|Engineering|Mechanical Engineering||
|Journalism|Print||
|Journalism|Investigative||
|Journalism|Sports||

2. JSON Documents

- 'Map' is a document data type which allows us to store unordered collections of KVPs (ex: metadata, below)
- 'List' provides a way to store ordered collections of KVPs

> Table 9

|product_id (pk)|metadata|
| :------- | :------- |
|P001| {"category": "Toys", "price": "12.56", "name": "Lego Thingy", colors: ['blue', 'red', 'yellow']}|
|P002|{"category": "Books", "price": "31.00", "name": "The Stand"}|
|P003|{"category": "DVD", "price": "39.99", "name": "Firefly Complete Series", "episodes": {...}}|

### Multi-Value Sorts and Filters (8.53)

Example:  return items by country, state, and city

#### Multi-Value Filters

> Table 10

|customer (pk)|country|state|city|
| :------- | :------- | :------- | :------- |
|John|US|CA|San Francisco|
|Tom|US|CA|San Diego|
|John|US|CA|San Diego|
|Sara|US|FL|Miami|

One approach is as follows:
- customer = pk
- country = sk
- filter on: state = "CA" and city = "San Diego"

But filtering occurs after the initial query.  So this approach uses a lot of resources, since you are checking every item in the table just to return the "San Diego" results. 

#### Multi-Value Sorts

> Table 11

|customer (pk)|country_state_city (sk)|
| :------- | :------- | :------- | :------- |
|John|US\|CA\|San Francisco|
|Tom|US\|CA\|San Diego|
|John|US\|CA\|San Diego|
|Sara|US\|FL\|Miami|

This approach allows you to easily sort based on multiple values.  You could make country_state_city a gsi and it would work just as well.

If you then wanted to return all California results, you could query on a partial sort key, as in: "customer"= "John" and "country_state_city" BEGINS_WITH "US|CA"

### Error Handling

All Dynamo DB sdk methods return an error object, and we can handle this object when it is not null.  It will include either an http 400 or http 5xx response.

DynamoDb aws-sdk will automatically retry any requests which receive the 'Provisioned Throughput Exceeded' Exception, using the 'Exponential Backoff' approach.  Meaning it will try again and wait a little longer on each attempt. You should set the max number of retries to stop around one minute.

### Additional Best Practices

- To store large attributes, consider using compression, S3 (save url as attribute), or splitting the attributes across multiple items
- Nice explanation of indexes is [here](https://medium.com/expedia-group-tech/dynamodb-efficient-indexes-cc30c4997012)