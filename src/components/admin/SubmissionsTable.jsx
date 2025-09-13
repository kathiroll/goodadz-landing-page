import { useState, useEffect } from 'react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import apiService from '../../services/apiService';

const SubmissionsTable = ({ ads }) => {
  console.log('📝 SUBMISSIONS TABLE: Component rendered with props:', {
    adsExists: !!ads,
    adsType: typeof ads,
    adsIsArray: Array.isArray(ads),
    adsLength: Array.isArray(ads) ? ads.length : 'N/A',
    ads: ads
  });

  const [selectedAdId, setSelectedAdId] = useState('');
  const [selectedApiKey, setSelectedApiKey] = useState('');
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 50,
    total: 0,
    totalPages: 0
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [apiKeys, setApiKeys] = useState([]);

  useEffect(() => {
    if (ads && ads.length > 0 && !selectedAdId) {
      setSelectedAdId(ads[0].id);
    }
  }, [ads, selectedAdId]);

  useEffect(() => {
    if (selectedAdId) {
      loadSubmissions();
    }
  }, [selectedAdId, selectedApiKey, pagination.page]);

  useEffect(() => {
    // Load available API keys for filtering
    loadApiKeys();
  }, []);

  const loadSubmissions = async () => {
    if (!selectedAdId) {
      console.log('📝 SUBMISSIONS TABLE: No selectedAdId, skipping load');
      return;
    }

    console.log('📝 SUBMISSIONS TABLE: Loading submissions for ad:', {
      selectedAdId,
      page: pagination.page,
      limit: pagination.limit
    });

    try {
      setLoading(true);
      setError('');
      
      console.log('📝 SUBMISSIONS TABLE: Making API call...');
      // Don't send selectedApiKey to backend since it doesn't understand nested structure
      // We'll do client-side filtering instead
      const response = await apiService.getFormSubmissions(selectedAdId, pagination.page, pagination.limit, null);
      
      console.log('📝 SUBMISSIONS TABLE: API response received:', {
        dataType: typeof response,
        isObject: typeof response === 'object',
        isNull: response === null,
        keys: response ? Object.keys(response) : null,
        fullData: response
      });

      // Extract data from response (API returns data wrapped in 'data' key)
      const data = response?.data || response;
      console.log('📝 SUBMISSIONS TABLE: Extracted data from response:', {
        extractedDataType: typeof data,
        extractedDataKeys: data ? Object.keys(data) : null,
        extractedData: data
      });

      // For submissions, the data might be directly an array or have submissions/total structure
      let submissionsArray = [];
      let totalValue = 0;

      if (Array.isArray(data)) {
        // If data is directly an array of submissions
        submissionsArray = data;
        totalValue = data.length;
        console.log('📝 SUBMISSIONS TABLE: Data is direct array of submissions');
      } else if (data && typeof data === 'object') {
        // If data has submissions and total fields
        submissionsArray = data.submissions || data.data || [];
        totalValue = data.total || data.count || submissionsArray.length;
        console.log('📝 SUBMISSIONS TABLE: Data is object with submissions field');
      }

      console.log('📝 SUBMISSIONS TABLE: Processed submissions data:', {
        submissionsExists: !!submissionsArray,
        submissionsType: typeof submissionsArray,
        isArray: Array.isArray(submissionsArray),
        length: Array.isArray(submissionsArray) ? submissionsArray.length : 'N/A',
        firstItemKeys: Array.isArray(submissionsArray) && submissionsArray.length > 0 ? Object.keys(submissionsArray[0]) : null,
        submissionsData: submissionsArray
      });

      // Validate submissions structure based on your API format
      if (submissionsArray.length > 0) {
        const expectedSubmissionFields = ['adId', 'sessionId', 'formData', 'submittedAt'];
        submissionsArray.forEach((submission, index) => {
          const missingSubmissionFields = expectedSubmissionFields.filter(field => !(field in submission));
          if (missingSubmissionFields.length > 0) {
            console.warn(`📝 SUBMISSIONS TABLE: Submission at index ${index} missing expected fields:`, missingSubmissionFields);
          }
          
          // Log detailed structure including top-level apiKeyInfo
          const apiKeyInfo = submission.apiKeyInfo;
          console.log(`📝 SUBMISSIONS TABLE: Submission ${index} structure:`, {
            adId: submission.adId,
            sessionId: submission.sessionId,
            formData: submission.formData,
            submittedAt: submission.submittedAt,
            apiKeyInfo: apiKeyInfo,
            hasApiKeyInfo: !!apiKeyInfo,
            apiKeyFromInfo: apiKeyInfo?.apiKey,
            emailFromInfo: apiKeyInfo?.email,
            websiteFromInfo: apiKeyInfo?.websiteUrl,
            allFields: Object.keys(submission),
            formDataKeys: submission.formData ? Object.keys(submission.formData) : null
          });
        });
      }
      console.log('📝 SUBMISSIONS TABLE: Total and pagination data:', {
        totalRaw: data.total,
        totalProcessed: totalValue,
        totalType: typeof data.total,
        currentPage: pagination.page,
        limit: pagination.limit,
        calculatedTotalPages: Math.ceil(totalValue / pagination.limit)
      });
      
      setSubmissions(submissionsArray);
      setPagination(prev => ({
        ...prev,
        total: totalValue,
        totalPages: Math.ceil(totalValue / prev.limit)
      }));

      console.log('📝 SUBMISSIONS TABLE: State updated successfully:', {
        submissionsCount: submissionsArray.length,
        totalRecords: totalValue,
        totalPages: Math.ceil(totalValue / pagination.limit)
      });

    } catch (err) {
      console.error('📝 SUBMISSIONS TABLE: Loading error:', err);
      console.error('📝 SUBMISSIONS TABLE: Error details:', {
        message: err.message,
        stack: err.stack,
        name: err.name,
        selectedAdId,
        page: pagination.page,
        limit: pagination.limit
      });
      setError('Failed to load submissions data');
    } finally {
      setLoading(false);
      console.log('📝 SUBMISSIONS TABLE: Loading process completed');
    }
  };

  const loadApiKeys = async () => {
    try {
      console.log('🔑 Loading API keys for filtering...');
      const response = await apiService.getAllApiKeys(1, 1000); // Get all API keys
      
      if (response.success && response.data) {
        setApiKeys(response.data);
        console.log('✅ API keys loaded for filtering:', response.data.length);
      } else {
        console.log('📝 FAILED TO LOAD API KEYS FOR FILTERING: SUBMISSIONS TABLE: API keys response data:', response.data);
      }
    } catch (err) {
      console.error('❌ Failed to load API keys for filtering:', err);
      // Don't show error to user for this optional feature
    }
  };

  // Extract unique API keys from current submissions for filtering
  const getUniqueApiKeysFromSubmissions = () => {
    const uniqueApiKeys = new Map();
    
    console.log('🔍 EXTRACTING API KEYS FROM SUBMISSIONS:', {
      totalSubmissions: submissions.length,
      firstSubmissionStructure: submissions.length > 0 ? {
        hasFormData: !!submissions[0].formData,
        formDataKeys: submissions[0].formData ? Object.keys(submissions[0].formData) : null,
        hasApiKeyInfo: !!submissions[0].apiKeyInfo,
        apiKeyInfo: submissions[0].apiKeyInfo
      } : null
    });
    
    submissions.forEach((submission, index) => {
      const apiKeyInfo = submission.apiKeyInfo; // apiKeyInfo is at top level, not in formData
      console.log(`🔍 Submission ${index} API key extraction:`, {
        hasFormData: !!submission.formData,
        hasApiKeyInfo: !!apiKeyInfo,
        apiKeyInfo: apiKeyInfo,
        extractedApiKey: apiKeyInfo?.apiKey
      });
      
      if (apiKeyInfo?.apiKey) {
        uniqueApiKeys.set(apiKeyInfo.apiKey, {
          apiKey: apiKeyInfo.apiKey,
          email: apiKeyInfo.email,
          websiteUrl: apiKeyInfo.websiteUrl
        });
      }
    });
    
    const result = Array.from(uniqueApiKeys.values());
    console.log('🔍 EXTRACTED UNIQUE API KEYS:', result);
    return result;
  };

  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  const exportToCSV = () => {
    if (!submissions.length) return;

    // Get all unique form field keys from filtered submissions
    const allKeys = new Set();
    filteredSubmissions.forEach(submission => {
      if (submission.formData) {
        Object.keys(submission.formData).forEach(key => allKeys.add(key));
      }
    });

    const headers = ['Date', 'Ad ID', 'Session ID', 'API Key', 'Email', 'Website URL', ...Array.from(allKeys)];
    
    const csvContent = [
      headers.join(','),
      ...filteredSubmissions.map(submission => {
        const apiKeyInfo = submission.apiKeyInfo; // apiKeyInfo is at top level
        const row = [
          new Date(submission.submittedAt || submission.createdAt || submission.date).toLocaleDateString(),
          submission.adId || 'N/A',
          submission.sessionId || 'N/A',
          apiKeyInfo?.apiKey || 'N/A',
          apiKeyInfo?.email || 'N/A',
          apiKeyInfo?.websiteUrl || 'N/A',
          ...Array.from(allKeys).map(key => {
            const value = submission.formData?.[key] || '';
            // Escape commas and quotes for CSV
            return `"${String(value).replace(/"/g, '""')}"`;
          })
        ];
        return row.join(',');
      })
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    const filename = `submissions_${selectedAdId}${selectedApiKey ? `_${selectedApiKey.substring(0, 8)}` : ''}_${new Date().toISOString().split('T')[0]}.csv`;
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredSubmissions = submissions.filter(submission => {
    const apiKeyInfo = submission.apiKeyInfo; // apiKeyInfo is at top level
    
    // Filter by selected API key first
    if (selectedApiKey && apiKeyInfo?.apiKey !== selectedApiKey) {
      return false;
    }
    
    // Then filter by search term
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    
    return (
      submission.adId?.toLowerCase().includes(searchLower) ||
      submission.sessionId?.toLowerCase().includes(searchLower) ||
      apiKeyInfo?.apiKey?.toLowerCase().includes(searchLower) ||
      apiKeyInfo?.email?.toLowerCase().includes(searchLower) ||
      apiKeyInfo?.websiteUrl?.toLowerCase().includes(searchLower) ||
      JSON.stringify(submission.formData || {}).toLowerCase().includes(searchLower)
    );
  });

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
      {/* Controls */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Select Ad</label>
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
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Filter by API Key</label>
                <select
                  value={selectedApiKey}
                  onChange={(e) => setSelectedApiKey(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">All API Keys</option>
                  {(() => {
                    // Combine API keys from both sources and deduplicate
                    const submissionApiKeys = getUniqueApiKeysFromSubmissions();
                    const allApiKeys = new Map();
                    
                    // Add API keys from submissions first (they have priority)
                    submissionApiKeys.forEach(apiKey => {
                      allApiKeys.set(apiKey.apiKey, apiKey);
                    });
                    
                    // Add API keys from API call (if not already present)
                    apiKeys.forEach(apiKey => {
                      if (!allApiKeys.has(apiKey.apiKey)) {
                        allApiKeys.set(apiKey.apiKey, apiKey);
                      }
                    });
                    
                    return Array.from(allApiKeys.values()).map(apiKey => (
                      <option key={apiKey.apiKey} value={apiKey.apiKey}>
                        {apiKey.email ? `${apiKey.email} (${apiKey.apiKey.substring(0, 8)}...)` : `${apiKey.apiKey.substring(0, 8)}...`}
                      </option>
                    ));
                  })()}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by Ad ID, Session ID, API Key, Email, Website URL, or form data..."
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex items-end space-x-3">
              <Button onClick={loadSubmissions} disabled={loading} size="sm">
                {loading ? 'Loading...' : 'Refresh'}
              </Button>
              <Button 
                onClick={() => {
                  console.log('🔍 MANUAL DEBUG - Current submissions structure:', submissions);
                  console.log('🔍 MANUAL DEBUG - Extracted API keys:', getUniqueApiKeysFromSubmissions());
                  console.log('🔍 MANUAL DEBUG - Filtered submissions:', filteredSubmissions);
                }} 
                variant="outline"
                size="sm"
              >
                Debug Data
              </Button>
              <Button 
                onClick={exportToCSV} 
                disabled={!filteredSubmissions.length}
                variant="outline"
                size="sm"
              >
                Export CSV
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Submissions Table */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Form Submissions {selectedAd && `- ${selectedAd.title || `Ad ${selectedAd.id}`}`}
            </h3>
            <div className="text-sm text-gray-600">
              {filteredSubmissions.length} of {pagination.total} submissions
            </div>
          </div>

          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
              <p className="text-gray-600">Loading submissions...</p>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <p className="text-red-600 mb-4">{error}</p>
              <Button onClick={loadSubmissions} size="sm">
                Try Again
              </Button>
            </div>
          ) : filteredSubmissions.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No submissions found</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Ad ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Session ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        API Key
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Form Data
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredSubmissions.map((submission, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Date(submission.submittedAt || submission.createdAt || submission.date).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {submission.adId || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {submission.sessionId || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {(() => {
                            const apiKeyInfo = submission.apiKeyInfo; // apiKeyInfo is at top level
                            console.log('🎨 RENDERING API KEY for submission:', {
                              hasFormData: !!submission.formData,
                              formDataKeys: submission.formData ? Object.keys(submission.formData) : null,
                              hasApiKeyInfo: !!apiKeyInfo,
                              apiKeyInfo: apiKeyInfo,
                              willRenderApiKey: !!apiKeyInfo?.apiKey
                            });
                            
                            if (apiKeyInfo?.apiKey) {
                              return (
                                <div>
                                  <div className="font-mono text-xs">
                                    {apiKeyInfo.apiKey.substring(0, 8)}...{apiKeyInfo.apiKey.substring(apiKeyInfo.apiKey.length - 4)}
                                  </div>
                                  {apiKeyInfo.email && (
                                    <div className="text-xs text-gray-600 mt-1">
                                      {apiKeyInfo.email}
                                    </div>
                                  )}
                                  {apiKeyInfo.websiteUrl && (
                                    <div className="text-xs text-blue-500 mt-1 truncate max-w-xs">
                                      <a href={apiKeyInfo.websiteUrl} target="_blank" rel="noopener noreferrer" className="hover:text-blue-700">
                                        {apiKeyInfo.websiteUrl}
                                      </a>
                                    </div>
                                  )}
                                </div>
                              );
                            }
                            console.log('🎨 RENDERING N/A for API key');
                            return 'N/A';
                          })()}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {submission.formData ? (
                            <div className="space-y-1">
                              {Object.entries(submission.formData).map(([key, value]) => (
                                <div key={key} className="flex">
                                  <span className="font-medium text-gray-600 mr-2">{key}:</span>
                                  <span className="text-gray-900">{String(value)}</span>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <span className="text-gray-500">No data</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="flex items-center justify-between mt-6">
                  <div className="text-sm text-gray-700">
                    Showing page {pagination.page} of {pagination.totalPages}
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      onClick={() => handlePageChange(pagination.page - 1)}
                      disabled={pagination.page === 1}
                      variant="outline"
                      size="sm"
                    >
                      Previous
                    </Button>
                    <Button
                      onClick={() => handlePageChange(pagination.page + 1)}
                      disabled={pagination.page === pagination.totalPages}
                      variant="outline"
                      size="sm"
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SubmissionsTable;