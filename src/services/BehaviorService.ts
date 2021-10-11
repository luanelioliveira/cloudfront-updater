import {
  DefaultCacheBehavior,
  CacheBehaviors,
  LambdaFunctionAssociation,
} from '@aws-sdk/client-cloudfront';
import AwsUtils from '../utils/AwsUtils';

export default class BehaviorService {
  updateCaches = (
    behaviors: CacheBehaviors,
    lambdaEdgeArn: string,
    version: string,
  ): void => {
    if (behaviors.Quantity === 0) return;
    behaviors.Items.forEach((behavior) => {
      this.updateLambdaEdgeVersion(behavior, lambdaEdgeArn, version);
    });
  };

  updateDefaultCache = (
    behavior: DefaultCacheBehavior,
    lambdaEdgeArn: string,
    version: string,
  ): void => {
    this.updateLambdaEdgeVersion(behavior, lambdaEdgeArn, version);
  };

  hasDefaultCacheWithLambdaEdge = (
    behavior: DefaultCacheBehavior,
    arn: string,
  ): boolean => this.hasLambdaEdge(behavior, arn);

  hasCacheWithLambdaEdge = (
    behaviors: CacheBehaviors,
    arn: string,
  ): boolean => {
    if (behaviors.Quantity === 0) return false;
    return behaviors.Items.some((behavior) =>
      this.hasLambdaEdge(behavior, arn),
    );
  };

  updateLambdaEdgeVersion = (
    behavior: any,
    arn: string,
    version: string,
  ): void => {
    if (behavior.LambdaFunctionAssociations.Quantity === 0) return;
    const newArn = AwsUtils.getArnWithVersion(arn, version);
    behavior.LambdaFunctionAssociations.Items.filter(
      (item: LambdaFunctionAssociation) => item.LambdaFunctionARN.includes(arn),
    ).forEach((item: LambdaFunctionAssociation) => {
      item.LambdaFunctionARN = newArn;
    });
  };

  private hasLambdaEdge = (behavior: any, arn: string): boolean => {
    if (behavior.LambdaFunctionAssociations.Quantity === 0) {
      return false;
    }

    let existing = false;
    behavior.LambdaFunctionAssociations.Items.forEach(
      (item: LambdaFunctionAssociation) => {
        if (item.LambdaFunctionARN.includes(arn)) {
          existing = true;
        }
      },
    );

    return existing;
  };
}
