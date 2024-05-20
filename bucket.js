// Write a function to create a private s3 bucket with a random name in us-east-2
// and return the bucket name.
import * as aws from 'aws-sdk'
function createBucket() {
    const s3 = new aws.S3({ region: 'us-east-2' });
    const bucketName = randomString(8);
    const params = {
        Bucket: bucketName,
        ACL: 'private',
    };
    return s3.createBucket(params).promise()
        .then(() => bucketName);
}
