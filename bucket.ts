// Write a function to create a private s3 bucket with a random name in us-east-2
// and return the bucket name.
import { S3Client, CreateBucketCommand, CreateBucketCommandInput } from "@aws-sdk/client-s3";
const log4js = require("log4js");
const logger = log4js.getLogger();
logger.level = "all";
export const createPrivateBucket = async (s3Client: S3Client, bucketName: CreateBucketCommandInput["Bucket"]) => {
  // Mandatory input validation
  if (s3Client == null || bucketName == null || !bucketName.trim()) {
    logger.error("Mandatory input parameters should not be null");
    return null;
  }

  // Setting up the parameters.
  const params: CreateBucketCommandInput = {
    Bucket: bucketName,
  };

  try {
    // Sending the request to create bucket with the requested parameters.
    const createBucketResponse = await s3Client.send(new CreateBucketCommand(params));

    logger.info("Successfully created bucket");

    // Returns the bucket name.
    return createBucketResponse;
  } catch (err) {
    logger.error("Error while creating the S3 bucket ::: ", err);
    throw err;
  }
};
