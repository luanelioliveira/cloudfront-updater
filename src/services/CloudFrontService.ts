import AwsClientService from '../clients/AwsClientService';
import BehaviorService from './BehaviorService';

export default class CloudFrontService {
  private awsClientService: AwsClientService;

  private behaviorService: BehaviorService;

  constructor(awsClientService: AwsClientService) {
    this.awsClientService = awsClientService;
    this.behaviorService = new BehaviorService();
  }

  updateAllDistributions = async (arn: string, newVersion: string) => {
    const distributionIds = await this.getDistributionIdsWithLambdaEdge(arn);
    distributionIds.forEach(async (distributionId) => {
      this.updateDistributionById(arn, newVersion, distributionId);
    });
  };

  updateDistributionById = async (
    arn: string,
    newVersion: string,
    distributionId: string,
  ) => {
    const data = await this.awsClientService.getDistributionById(
      distributionId,
    );

    const defaultCache = data.config.DefaultCacheBehavior;
    this.behaviorService.updateDefaultCache(defaultCache, arn, newVersion);

    const caches = data.config.CacheBehaviors;
    this.behaviorService.updateCaches(caches, arn, newVersion);

    await this.awsClientService.updateDistribution(data);
  };

  getDistributionIdsWithLambdaEdge = async (arn: string) => {
    const ids = [];
    try {
      const distributions = await this.awsClientService.getAllDistributions();
      distributions.forEach((distribution) => {
        const caches = distribution.CacheBehaviors;
        if (this.behaviorService.hasCacheWithLambdaEdge(caches, arn)) {
          ids.push(distribution.Id);
          return;
        }

        const defaultCaches = distribution.DefaultCacheBehavior;
        if (
          this.behaviorService.hasDefaultCacheWithLambdaEdge(defaultCaches, arn)
        ) {
          ids.push(distribution.Id);
        }
      });
    } catch (err) {
      return [];
    }
    return ids;
  };
}
