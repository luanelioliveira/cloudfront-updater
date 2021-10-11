const getArnWithVersion = (arn: string, version: string) => `${arn}:${version}`;

const getLambdaFunctionArn = (
  region: string,
  accountId: string,
  name: string,
) => `arn:aws:lambda:${region}:${accountId}:function:${name}`;

export default { getArnWithVersion, getLambdaFunctionArn };
