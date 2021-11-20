# Update Lambda Edge Versions


This project is to update the Lambda@Edge versions in distributions of the AWS CloudFront.
This application allows two ways to update distributions, which are:

  - You can update version by CDN id;
  - or update version of the all CDNs

## How to Run

Set your AWS Credentials in the `~/.aws/credentials` file

Update the variables in the `index.js` file:
  - REGION: Lambda@Edge Region;
  - ACCOUNT_ID = Lambda@Edge Account Number;
  - LAMBDA_EDGE_NAME = "Lambda@Edge Name"
  - NEW_VERSION = "Lambda@Edge New Version Number";

Install the dependencies
```bash
  npm install
```

Build project
```bash
  npm run build
```

Running
```bash
   npm run start
```
