import { STSClient, AssumeRoleWithWebIdentityCommand } from "@aws-sdk/client-sts";
import { fromTokenFile } from "@aws-sdk/credential-providers";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import fs from "fs";
import path from "path";

// Load client certificate and key
const clientCertificate = fs.readFileSync(path.resolve("../crypto/client.pem"), "utf-8");
const clientKey = fs.readFileSync(path.resolve("../crypto/client.key"), "utf-8");

const profileArn = "arn:aws:rolesanywhere:us-east-2:314940726554:profile/da4a4409-0d30-475a-b620-89b8c94e5b37";
const roleArn = "arn:aws:iam::314940726554:role/agencymobiledatasandbox";
const trustAnchorArn = "arn:aws:rolesanywhere:us-east-2:314940726554:trust-anchor/e0634358-ce5b-45ea-9273-218a5f82291b";

// Initialize the STS client
const stsClient = new STSClient({
  region: "us-east-2", // specify your AWS region
  credentials: fromTokenFile({
    profile: "default",
    clientCert: clientCertificate,
    clientKey: clientKey,
    roleArn: roleArn,
    trustAnchorArn: trustAnchorArn,
    profileArn: profileArn,
  }),
});

// Function to assume role and get temporary credentials
async function getTemporaryCredentials() {
  try {
    const command = new AssumeRoleWithWebIdentityCommand({
      RoleArn: roleArn,
      RoleSessionName: "session1",
      WebIdentityToken: clientCertificate, // Use the certificate as a token
    });

    const response = await stsClient.send(command);
    const { AccessKeyId, SecretAccessKey, SessionToken } = response.Credentials;

    // Create an S3 client with the temporary credentials
    const s3Client = new S3Client({
      region: "us-east-2",
      credentials: {
        accessKeyId: AccessKeyId,
        secretAccessKey: SecretAccessKey,
        sessionToken: SessionToken,
      },
    });

    // Generate the presigned URL
    const bucketName = "gp2togp3-backend-aws-bucket";
    const objectKey = "photos/helena_lopes_h1111.jpg";
    const getObjectCommand = new GetObjectCommand({
      Bucket: bucketName,
      Key: objectKey,
    });

    const presignedUrl = await getSignedUrl(s3Client, getObjectCommand, {
      expiresIn: 3600, // URL expires in 1 hour
    });

    console.log("Presigned URL:", presignedUrl);
  } catch (error) {
    console.error("Error assuming role or creating presigned URL:", error);
  }
}

// Call the function to retrieve and display the presigned URL
getTemporaryCredentials();
