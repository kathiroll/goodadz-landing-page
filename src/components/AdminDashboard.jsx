import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import OverviewCards from './admin/OverviewCards';
import ConversionFunnel from './admin/ConversionFunnel';
import AdPerformance from './admin/AdPerformance';
import SubmissionsTable from './admin/SubmissionsTable';
import APIKeysManagement from './admin/APIKeysManagement';
import apiService from '../services/apiService';

const AdminDashboard = ({ onLogout }) => {
  const [overviewData, setOverviewData] = useState(null);
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError('');
      
      console.log('🔄 Loading dashboard data...');
      console.log('📊 ADMIN DASHBOARD: Starting data load process');
      
      // Load overview and ads data with individual error handling
      const [overviewResult, adsResult] = await Promise.allSettled([
        apiService.getOverview().catch(err => {
          console.error('❌ Overview API failed:', err);
          console.error('📊 ADMIN DASHBOARD: Overview API error details:', {
            message: err.message,
            stack: err.stack,
            name: err.name
          });
          return null;
        }),
        apiService.getAds().catch(err => {
          console.error('❌ Ads API failed:', err);
          console.error('📊 ADMIN DASHBOARD: Ads API error details:', {
            message: err.message,
            stack: err.stack,
            name: err.name
          });
          return [];
        })
      ]);

      console.log('📊 ADMIN DASHBOARD: Promise.allSettled results:', {
        overviewStatus: overviewResult.status,
        overviewValue: overviewResult.value,
        overviewReason: overviewResult.reason,
        adsStatus: adsResult.status,
        adsValue: adsResult.value,
        adsReason: adsResult.reason
      });

      // Handle overview data
      if (overviewResult.status === 'fulfilled' && overviewResult.value) {
        console.log('📊 ADMIN DASHBOARD: Overview data structure received:', {
          dataType: typeof overviewResult.value,
          isObject: typeof overviewResult.value === 'object',
          isNull: overviewResult.value === null,
          keys: overviewResult.value ? Object.keys(overviewResult.value) : null,
          fullData: overviewResult.value
        });

        overviewResult.value = overviewResult.value?.data || overviewResult.value;
        
        // Validate expected structure
        const expectedFields = ['totalUsers', 'totalSubmissions', 'journeyStats'];
        const missingFields = expectedFields.filter(field => !(field in overviewResult.value));
        if (missingFields.length > 0) {
          console.warn('📊 ADMIN DASHBOARD: Overview data missing expected fields:', missingFields);
        }
        
        if (overviewResult.value.journeyStats) {
          const expectedJourneyFields = ['widgetShownCount', 'adSelectedCount', 'formSubmittedCount'];
          const missingJourneyFields = expectedJourneyFields.filter(field => !(field in overviewResult.value.journeyStats));
          if (missingJourneyFields.length > 0) {
            console.warn('📊 ADMIN DASHBOARD: Journey stats missing expected fields:', missingJourneyFields);
          }
          console.log('📊 ADMIN DASHBOARD: Journey stats structure:', overviewResult.value.journeyStats);
        } else {
          console.warn('📊 ADMIN DASHBOARD: No journeyStats found in overview data');
        }
        
        setOverviewData(overviewResult.value);
        console.log('✅ Overview data loaded successfully');
        console.log('📊 ADMIN DASHBOARD: Overview data set to state:', overviewResult.value);
      } else {
        console.warn('⚠️ Overview data failed to load, using fallback');
        console.warn('📊 ADMIN DASHBOARD: Overview failure details:', {
          status: overviewResult.status,
          value: overviewResult.value,
          reason: overviewResult.reason
        });
        const fallbackData = {
          totalUsers: 0,
          totalSubmissions: 0,
          journeyStats: {
            widgetShownCount: 0,
            adSelectedCount: 0,
            formSubmittedCount: 0
          }
        };
        setOverviewData(fallbackData);
        console.log('📊 ADMIN DASHBOARD: Set fallback overview data:', fallbackData);
      }

      // Handle ads data
      if (adsResult.status === 'fulfilled' && adsResult.value) {
        
        console.log('📊 ADMIN DASHBOARD: Ads data structure received:', {
          dataType: typeof adsResult.value,
          isArray: Array.isArray(adsResult.value),
          length: Array.isArray(adsResult.value) ? adsResult.value.length : 'N/A',
          firstItemKeys: Array.isArray(adsResult.value) && adsResult.value.length > 0 ? Object.keys(adsResult.value[0]) : null,
          fullData: adsResult.value
        });
        
        const adsArray = Array.isArray(adsResult.value.data) ? adsResult.value.data : [];
        if (!Array.isArray(adsResult.value)) {
          console.warn('📊 ADMIN DASHBOARD: Ads data is not an array, converting:', {
            originalType: typeof adsResult.value,
            originalValue: adsResult.value,
            convertedValue: adsArray
          });
        }
        
        // Validate ad structure
        if (adsArray.length > 0) {
          const expectedAdFields = ['id', 'title', 'active'];
          adsArray.forEach((ad, index) => {
            const missingAdFields = expectedAdFields.filter(field => !(field in ad));
            if (missingAdFields.length > 0) {
              console.warn(`📊 ADMIN DASHBOARD: Ad at index ${index} missing expected fields:`, missingAdFields);
            }
            console.log(`📊 ADMIN DASHBOARD: Ad ${index} structure:`, ad);
          });
        }
        
        setAds(adsArray);
        console.log('✅ Ads data loaded successfully');
        console.log('📊 ADMIN DASHBOARD: Ads data set to state:', adsArray);
      } else {
        console.warn('⚠️ Ads data failed to load, using empty array');
        console.warn('📊 ADMIN DASHBOARD: Ads failure details:', {
          status: adsResult.status,
          value: adsResult.value,
          reason: adsResult.reason
        });
        setAds([]);
        console.log('📊 ADMIN DASHBOARD: Set empty ads array');
      }

      console.log('📊 ADMIN DASHBOARD: Final state data:', {
        overviewData: overviewData,
        adsCount: ads.length,
        timestamp: new Date().toISOString()
      });

    } catch (err) {
      console.error('💥 Critical dashboard loading error:', err);
      console.error('📊 ADMIN DASHBOARD: Critical error details:', {
        message: err.message,
        stack: err.stack,
        name: err.name,
        timestamp: new Date().toISOString()
      });
      setError('Failed to initialize dashboard. Please check your connection and try again.');
    } finally {
      setLoading(false);
      console.log('📊 ADMIN DASHBOARD: Loading process completed');
    }
  };

  const handleRefresh = () => {
    loadDashboardData();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Data</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <div className="space-x-3">
              <Button onClick={handleRefresh} className="bg-blue-600 hover:bg-blue-700">
                Try Again
              </Button>
              <Button onClick={onLogout} variant="outline">
                Logout
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center mr-3">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h1 className="text-xl font-semibold text-gray-900">GoodAds Admin Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                onClick={handleRefresh}
                variant="outline"
                size="sm"
                className="flex items-center space-x-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span>Refresh</span>
              </Button>
              <Button
                onClick={onLogout}
                variant="outline"
                size="sm"
                className="text-red-600 border-red-200 hover:bg-red-50"
              >
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:grid-cols-none lg:inline-flex">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="funnel">Conversion Funnel</TabsTrigger>
            <TabsTrigger value="performance">Ad Performance</TabsTrigger>
            <TabsTrigger value="submissions">Submissions</TabsTrigger>
            <TabsTrigger value="api-keys">API Keys</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Dashboard Overview</h2>
              {!overviewData && (
                <div className="text-sm text-orange-600 bg-orange-50 px-3 py-1 rounded-lg">
                  ⚠️ Some data may be unavailable
                </div>
              )}
            </div>
            <OverviewCards overviewData={overviewData} ads={ads} />
          </TabsContent>

          <TabsContent value="funnel" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Conversion Funnel</h2>
              {!overviewData?.journeyStats && (
                <div className="text-sm text-orange-600 bg-orange-50 px-3 py-1 rounded-lg">
                  ⚠️ Funnel data unavailable
                </div>
              )}
            </div>
            <ConversionFunnel journeyStats={overviewData?.journeyStats} />
          </TabsContent>

          <TabsContent value="performance" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Ad Performance</h2>
              {ads.length === 0 && (
                <div className="text-sm text-orange-600 bg-orange-50 px-3 py-1 rounded-lg">
                  ⚠️ No ads available
                </div>
              )}
            </div>
            <AdPerformance ads={ads} />
          </TabsContent>

          <TabsContent value="submissions" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Form Submissions</h2>
              {ads.length === 0 && (
                <div className="text-sm text-orange-600 bg-orange-50 px-3 py-1 rounded-lg">
                  ⚠️ No ads available for submissions
                </div>
              )}
            </div>
            <SubmissionsTable ads={ads} />
          </TabsContent>

          <TabsContent value="api-keys" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">API Keys Management</h2>
            </div>
            <APIKeysManagement />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;