/**
 * Produce an s3 pre-signed after obtaining temporary credentials
 * from the IAM Roles Anywhere service
 * The fromProcess() method is used to obtain temporary credentials
 * from the IAM Roles Anywhere service by referencing a predefined role within
 * the aws config file.
 * The profile invokes the AWS code, aws-signing-helper passing the 
 * Trust anchor arn, role arn, profile arn, client cert, and client key 
 * The credentials are then used to create an S3 client object.
 */

import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { fromProcess } from '@aws-sdk/credential-providers';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const region = 'us-east-2';

/**
 * Create an S3 client authorized with the IAM Role Anywhere credentials
 * @param {string} region The AWS region to use
 * @param {string} profile The credentials to use within the config file
 */
const s3Client = new S3Client({
  region: region,
  credentials: fromProcess({
    profile: "ira",
    configFilepath: "/home/fjc013/.aws/config",
    filepath: "/home/fjc013/.aws/credentials",
  })
});

/**
 * Generate a pre-signed URL for the object "applause.png"
 * within the "gp2togp3-backend-aws-bucket" bucket
 */
const bucketName = 'gp2togp3-backend-aws-bucket';
const objectKey = 'photos/helena_lopes_h1111.jpg';
const expiresInSeconds = 604800; // Maximum allowed expiration (7 days)

const getObjectParams = {
  Bucket: bucketName,
  Key: objectKey
};

const command = new GetObjectCommand(getObjectParams);

getSignedUrl(s3Client, command, { expiresIn: expiresInSeconds })
  .then(url => {
    console.log('Pre-signed URL:', url);
    // Use the pre-signed URL as needed
  })
  .catch(err => {
    console.error('Error generating pre-signed URL:', err);
  });