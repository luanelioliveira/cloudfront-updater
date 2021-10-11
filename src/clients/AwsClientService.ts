import {
  CloudFront,
  DistributionConfig,
  DistributionList,
  DistributionSummary,
} from '@aws-sdk/client-cloudfront';
import FileUtils from '../utils/FileUtils';

interface IDistribution {
  id: string;
  config: DistributionConfig;
  eTag: string;
}

export default class AwsClientService {
  private cloudFront: CloudFront;

  constructor(cloudFront: CloudFront) {
    this.cloudFront = cloudFront;
  }

  getDistributionById = async (id: string): Promise<IDistribution> => {
    const params = { Id: id };
    const result = await this.cloudFront.getDistributionConfig(params);
    return {
      id,
      config: result.DistributionConfig,
      eTag: result.ETag,
    };
  };

  getAllDistributions = async (): Promise<DistributionSummary[]> => {
    const distributions = [];
    let hasNextPage = false;
    let maker = '';

    do {
      const result = await this.getDistributions(maker);
      distributions.push(...result.Items);
      maker = result.NextMarker;
      hasNextPage = result.IsTruncated;
    } while (hasNextPage);

    return distributions;
  };

  updateDistribution = async (distribution: IDistribution) => {
    try {
      FileUtils.save(`output_${distribution.id}.json`, distribution);

      const params = {
        Id: distribution.id,
        DistributionConfig: distribution.config,
        IfMatch: distribution.eTag,
      };

      await this.cloudFront.updateDistribution(params);

      console.log(`CDN ${distribution.id}\t[OK]\tupdated `);
      console.log(`${JSON.stringify(params)}`);
    } catch (err) {
      console.log(err);
    }
  };

  private getDistributions = async (
    maker: string,
  ): Promise<DistributionList> => {
    const params = { Marker: maker };
    const result = await this.cloudFront.listDistributions(params);
    return result.DistributionList;
  };
}
