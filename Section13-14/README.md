# AWS DynamoDB - The Complete Guide

## SECTION 13-14: Auto-Archiving Using TTL and Lambda, and Handling Large Items

### Create Archive Table and Add Trigger (Section 13)

The goal of this exercise is to enable streams and create a trigger on the global notes table. When an item expires based on TTL, the lambda should fire and migrate the item to a new archive table, with all of its attributes. The same method could be used to move the data to S3 for example.

1. Create a new table as directed
2. Add a trigger, using the same role as before
3. Set the trigger on the global table created in the Section 11 exercise and set the batch size to 5 since this is a small demo
4. You can use either 'Latest' or 'Trim Horizon' as the starting position, but 'Trim Horizon' starts at the last untrimmed stream record
5. Do not enable the trigger yet, create the function without it.
6. Once again, the course is outdated. The starter code in the lambda console is a little different from what is shown in the course. In this case, I consistently got 'Success' messages from the lambda console and in Cloudwatch, but nothing was being actually written to the new Archive table. Ultimately, I discovered that although the default code is an async function, that is what breaks this exercise, even if you add an await to the putItem operation. Remove the async from the function and it should work as expected.
7. There was a delay of about 30 minutes for most of the items to move, but they did in fact move over to the Archive table as anticipated.

### Handling Large Items

#### Compression and Binary (14.73) and Storing in S3 (14.74)

These exercises went to plan, no issues with outdated content. However, the instructor uses the npm package zlib. I try to avoid packages which have a low number of downloads and, in this case, were last published 9 years ago. I shopped around a little and chose [pako](https://www.npmjs.com/package/pako), which wraps some zlib functionality and has better stats.

Notes:

-   using compression to save attributes in binary format has the drawback of not allowing you to search for keywords or use filtering.
-   if you are using your own administrator role instead of the training role demonstrated at the beginning of the course, you don't need to worry about the IAM permissions segment.
