import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
// import { fromCertificateProviderSource } from '@aws-sdk/credential-providers';
import pkg from '@aws-sdk/credential-providers';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import * as fs from 'fs';
// import * as path from 'path';

const { fromCertificateProviderSource } = pkg;

// Define the required values
const trustAnchorArn = 'arn:aws:rolesanywhere:us-east-2:314940726554:trust-anchor/e0634358-ce5b-45ea-9273-218a5f82291b';
const profileArn = 'arn:aws:rolesanywhere:us-east-2:314940726554:profile/da4a4409-0d30-475a-b620-89b8c94e5b37';
const roleArn = 'arn:aws:iam::314940726554:role/agencymobiledatasandbox';
const certPemPath = '../crypto/client.pem';
const keyPemPath = '../crypto/client.key';
const region = 'us-east-2';

// Load the certificate and private key from files
const certPem = fs.readFileSync(certPemPath, 'utf8');
const keyPem = fs.readFileSync(keyPemPath, 'utf8');

console.log(certPem);
console.log(keyPem);
// Create an S3 client with the IAM Role Anywhere credentials
const s3Client = new S3Client({
    region: region,
  credentials: fromCertificateProviderSource({
    roleAnywhereTrustAnchorArn: trustAnchorArn,
    roleAnywhereMfaSerialNumber: profileArn,
    roleArn: roleArn,
    webIdentityTokenPem: certPem,
    privateKeyPem: keyPem
  })
});

// Generate a pre-signed URL for the object "applause.png"
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