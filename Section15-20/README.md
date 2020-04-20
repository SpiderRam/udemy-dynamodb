# AWS DynamoDB - The Complete Guide

## SECTIONS 15-20

Since the services in these exercises are not reliably part of the free tier, I did not execute most of them, just watched the videos.

---

### DAX (Section 15)

-   [amazon-dax-client](https://www.npmjs.com/package/amazon-dax-client)
-   DAX endpoints cannot be accessed from outside the VPC (Error code: NoRouteException), 15.76 addresses the solution to this

### On-Demand Backup & Restore (Section 16)

-   Create backups manually, or use the sdk and lambda to schedule creation and deletion of backups
-   PITR always restores data to a new table

### Server-Side Encryption at Rest (Section 17)

Note: there is no additional charge for SSE, and Key Management Service is free [to a point](https://aws.amazon.com/kms/pricing/). Also the GUI has changed since the course was last updated, they tell you the default setting is free, but the customer managed keys may result in charges:
![encryption](../assets/ddb-encryption.png)

-   Uses 256-bit AES Encryption with AWS KMS
-   Can only be enabled at the time of table creation, not after the fact
-   Once encryption is enabled on a table, it cannot be disabled
-   Happens internally so your app does not have to handle any of the logic
-   Once you create a table with encryption, you can see that it is enabled in the Overview pane, but the data will still be human readable in the table

### Logging with CloudTrail (Section 18)

-   Free... but not? Engage at your own [risk](https://aws.amazon.com/cloudtrail/pricing/). Since I acquired CloudWatch charges in Frankfurt from a previous exercise, I don't recommend it.

### Importing and Exporting Using Data Pipeline (Section 19)

-   [Pricing](https://aws.amazon.com/codepipeline/pricing/)

### Querying with Redshift (Section 20)

-   Redshift has a 2 month free trial (as of this writing, April 2020), and after that: [pricing](https://aws.amazon.com/redshift/pricing/)
-   This exercise requires SQL workbench (or the Mac equivalent)
-   Be aware of the [differences](https://hevodata.com/blog/dynamodb-to-redshift-methods-move-data/) between what is allowed in DynamoDB vs Redshift requirements
