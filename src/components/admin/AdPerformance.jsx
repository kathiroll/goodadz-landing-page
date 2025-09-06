import { useState, useEffect } from 'react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import apiService from '../../services/apiService';

const AdPerformance = ({ ads }) => {
  console.log('📈 AD PERFORMANCE: Component rendered with props:', {
    adsExists: !!ads,
    adsType: typeof ads,
    adsIsArray: Array.isArray(ads),
    adsLength: Array.isArray(ads) ? ads.length : 'N/A',
    ads: ads
  });

  const [selectedAdId, setSelectedAdId] = useState('');
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (ads && ads.length > 0 && !selectedAdId) {
      setSelectedAdId(ads[0].id);
    }
  }, [ads, selectedAdId]);

  useEffect(() => {
    if (selectedAdId) {
      loadAnalytics();
    }
  }, [selectedAdId]);

  const loadAnalytics = async () => {
    if (!selectedAdId) {
      console.log('📈 AD PERFORMANCE: No selectedAdId, skipping analytics load');
      return;
    }

    console.log('📈 AD PERFORMANCE: Loading analytics for ad:', selectedAdId);

    try {
      setLoading(true);
      setError('');
      
      console.log('📈 AD PERFORMANCE: Making API call...');
      const data = await apiService.getAdAnalytics(selectedAdId);
      
      console.log('📈 AD PERFORMANCE: API response received:', {
        dataType: typeof data,
        isObject: typeof data === 'object',
        isNull: data === null,
        keys: data ? Object.keys(data) : null,
        fullData: data
      });

      // Validate expected structure
      const expectedFields = ['eventAnalytics', 'avgTimeSpent', 'dropOffAnalysis'];
      const missingFields = expectedFields.filter(field => !(field in (data || {})));
      if (missingFields.length > 0) {
        console.warn('📈 AD PERFORMANCE: Response missing expected fields:', missingFields);
      }

      // Log eventAnalytics structure
      if (data?.eventAnalytics) {
        console.log('📈 AD PERFORMANCE: Event analytics structure:', {
          type: typeof data.eventAnalytics,
          isObject: typeof data.eventAnalytics === 'object',
          keys: Object.keys(data.eventAnalytics),
          values: Object.values(data.eventAnalytics),
          fullData: data.eventAnalytics
        });
      } else {
        console.warn('📈 AD PERFORMANCE: No event analytics data found');
      }

      // Log avgTimeSpent
      console.log('📈 AD PERFORMANCE: Average time spent:', {
        raw: data?.avgTimeSpent,
        type: typeof data?.avgTimeSpent,
        isNumber: typeof data?.avgTimeSpent === 'number',
        formatted: data?.avgTimeSpent ? `${data.avgTimeSpent.toFixed(1)}s` : 'N/A'
      });

      // Log dropOffAnalysis structure
      if (data?.dropOffAnalysis) {
        console.log('📈 AD PERFORMANCE: Drop-off analysis structure:', {
          type: typeof data.dropOffAnalysis,
          isObject: typeof data.dropOffAnalysis === 'object',
          keys: Object.keys(data.dropOffAnalysis),
          values: Object.values(data.dropOffAnalysis),
          fullData: data.dropOffAnalysis
        });
      } else {
        console.warn('📈 AD PERFORMANCE: No drop-off analysis data found');
      }

      setAnalytics(data);
      console.log('📈 AD PERFORMANCE: Analytics data set to state:', data);

    } catch (err) {
      console.error('📈 AD PERFORMANCE: Loading error:', err);
      console.error('📈 AD PERFORMANCE: Error details:', {
        message: err.message,
        stack: err.stack,
        name: err.name,
        selectedAdId
      });
      setError('Failed to load analytics data');
    } finally {
      setLoading(false);
      console.log('📈 AD PERFORMANCE: Loading process completed');
    }
  };

  const selectedAd = ads?.find(ad => ad.id === selectedAdId);

  if (!ads || ads.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-gray-500">No ads available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Ad Selection */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">Select Ad to Analyze</h3>
              <p className="text-sm text-gray-600">Choose an ad to view its performance metrics</p>
            </div>
            <div className="flex items-center space-x-3">
              <select
                value={selectedAdId}
                onChange={(e) => setSelectedAdId(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {ads.map(ad => (
                  <option key={ad.id} value={ad.id}>
                    {ad.title || `Ad ${ad.id}`}
                  </option>
                ))}
              </select>
              <Button onClick={loadAnalytics} disabled={loading} size="sm">
                {loading ? 'Loading...' : 'Refresh'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Selected Ad Info */}
      {selectedAd && (
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Ad Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-600">Title</p>
                <p className="text-gray-900">{selectedAd.title || 'Untitled'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Status</p>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  selectedAd.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {selectedAd.active ? 'Active' : 'Inactive'}
                </span>
              </div>
              {selectedAd.description && (
                <div className="md:col-span-2">
                  <p className="text-sm font-medium text-gray-600">Description</p>
                  <p className="text-gray-900">{selectedAd.description}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Analytics Data */}
      {loading ? (
        <Card>
          <CardContent className="p-6 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
            <p className="text-gray-600">Loading analytics...</p>
          </CardContent>
        </Card>
      ) : error ? (
        <Card>
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={loadAnalytics} size="sm">
              Try Again
            </Button>
          </CardContent>
        </Card>
      ) : analytics ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Event Analytics */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Event Analytics</h3>
              {analytics.eventAnalytics ? (
                <div className="space-y-3">
                  {Object.entries(analytics.eventAnalytics).map(([event, count]) => (
                    <div key={event} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
                      <span className="text-gray-600 capitalize">{event.replace(/([A-Z])/g, ' $1').trim()}</span>
                      <span className="font-semibold text-gray-900">{count.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">No event data available</p>
              )}
            </CardContent>
          </Card>

          {/* Time Spent */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Engagement Metrics</h3>
              <div className="space-y-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <p className="text-2xl font-bold text-blue-600">
                    {analytics.avgTimeSpent ? `${analytics.avgTimeSpent.toFixed(1)}s` : 'N/A'}
                  </p>
                  <p className="text-sm text-gray-600">Average Time Spent</p>
                </div>
                
                {analytics.dropOffAnalysis && (
                  <div className="space-y-2">
                    <h4 className="font-medium text-gray-900">Drop-off Analysis</h4>
                    {Object.entries(analytics.dropOffAnalysis).map(([stage, percentage]) => (
                      <div key={stage} className="flex justify-between items-center">
                        <span className="text-gray-600 capitalize">{stage}</span>
                        <span className="text-red-600 font-medium">{percentage}%</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-gray-500">Select an ad to view analytics</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AdPerformance;