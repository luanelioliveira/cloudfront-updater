import { SharedIniFileCredentials } from 'aws-sdk';
import { CloudFront } from '@aws-sdk/client-cloudfront';
import AwsClientService from './clients/AwsClientService';
import CloudFrontService from './services/CloudFrontService';
import AwsUtils from './utils/AwsUtils';

const REGION = 'region';
const ACCOUNT_ID = 'account-id';

const DISTRIBUTION_ID = 'distribution-id';
const LAMBDA_EDGE_NAME = 'lambda-edge-name';
const NEW_VERSION = 'lambda-edge-version';

const credentials = new SharedIniFileCredentials({ profile: 'default' });
const cloudfornt = new CloudFront({ region: REGION, credentials });
const aws = new AwsClientService(cloudfornt);
const service = new CloudFrontService(aws);

// Update by Distribution ID
(async () => {
  await service.updateDistributionById(
    AwsUtils.getLambdaFunctionArn(REGION, ACCOUNT_ID, LAMBDA_EDGE_NAME),
    NEW_VERSION,
    DISTRIBUTION_ID,
  );
})();

// Update All Distributions
// (async () => {
//   await cloudFrontService.updateAllDistributions(
//     AwsUtils.getLambdaFunctionArn(REGION, ACCOUNT_ID, LAMBDA_EDGE_NAME),
//     NEW_VERSION,
//   );
// })();
