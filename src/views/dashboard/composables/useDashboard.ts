import type { AssetsMetricsDto, AssetCreationTimeSeriesPointDto } from '@/api-client';
import { apiClient } from '@/lib/api-client';
import { throwError } from '@/lib/error-utils';

export const assetsMetricsQueryKey = ['dashboard', 'assets-metrics'] as const;

export const assetTimeSeriesQueryKey = (year: number) =>
  ['dashboard', 'asset-time-series', year] as const;

export const getAssetsMetrics = async (): Promise<AssetsMetricsDto> => {
  try {
    const response = await apiClient.statistics.statisticsControllerAssetsMetrics();
    return response.data;
  } catch (error) {
    throwError(error, 'There was an error getting the metrics data.');
  }
};

export const getAssetTimeSeries = async (
  year: number,
): Promise<AssetCreationTimeSeriesPointDto[]> => {
  try {
    const response = await apiClient.assets.assetsControllerGetAssetCreationTimeSeriesByYear({
      year,
    });
    return response.data;
  } catch (error) {
    throwError(
      error,
      'There was an error getting the time series data for Asset creation history.',
    );
  }
};
