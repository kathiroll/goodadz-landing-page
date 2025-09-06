import { Card, CardContent } from '../ui/card';

const OverviewCards = ({ overviewData, ads }) => {
  console.log('🎯 OVERVIEW CARDS: Component rendered with props:', {
    overviewDataExists: !!overviewData,
    overviewDataType: typeof overviewData,
    overviewData: overviewData,
    adsExists: !!ads,
    adsType: typeof ads,
    adsIsArray: Array.isArray(ads),
    adsLength: Array.isArray(ads) ? ads.length : 'N/A',
    ads: ads
  });

  // Safely calculate conversion rate
  const calculateConversionRate = () => {
    console.log('🎯 OVERVIEW CARDS: Calculating conversion rate...');
    console.log('🎯 OVERVIEW CARDS: Journey stats check:', {
      hasOverviewData: !!overviewData,
      hasJourneyStats: !!overviewData?.journeyStats,
      journeyStats: overviewData?.journeyStats
    });
    
    if (!overviewData?.journeyStats) {
      console.log('🎯 OVERVIEW CARDS: No journey stats available, returning N/A');
      return 'N/A';
    }
    
    const { formSubmittedCount, widgetShownCount } = overviewData.journeyStats;
    console.log('🎯 OVERVIEW CARDS: Conversion rate calculation values:', {
      formSubmittedCount,
      widgetShownCount,
      formSubmittedCountType: typeof formSubmittedCount,
      widgetShownCountType: typeof widgetShownCount
    });
    
    if (!widgetShownCount || widgetShownCount === 0) {
      console.log('🎯 OVERVIEW CARDS: Widget shown count is 0 or falsy, returning 0%');
      return '0%';
    }
    
    const rate = ((formSubmittedCount / widgetShownCount) * 100).toFixed(1);
    console.log('🎯 OVERVIEW CARDS: Calculated conversion rate:', `${rate}%`);
    return `${rate}%`;
  };

  // Calculate card values with logging
  const totalUsersValue = overviewData?.totalUsers ?? 'N/A';
  const totalSubmissionsValue = overviewData?.totalSubmissions ?? 'N/A';
  const activeAdsValue = Array.isArray(ads) ? ads.length : 'N/A';
  const conversionRateValue = calculateConversionRate();

  console.log('🎯 OVERVIEW CARDS: Card values calculated:', {
    totalUsers: {
      raw: overviewData?.totalUsers,
      processed: totalUsersValue,
      type: typeof overviewData?.totalUsers
    },
    totalSubmissions: {
      raw: overviewData?.totalSubmissions,
      processed: totalSubmissionsValue,
      type: typeof overviewData?.totalSubmissions
    },
    activeAds: {
      raw: ads,
      processed: activeAdsValue,
      isArray: Array.isArray(ads),
      length: Array.isArray(ads) ? ads.length : null
    },
    conversionRate: {
      processed: conversionRateValue,
      hasJourneyStats: !!overviewData?.journeyStats
    }
  });

  const cards = [
    {
      title: 'Total Users',
      value: totalUsersValue,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
        </svg>
      ),
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600',
      isError: !overviewData
    },
    {
      title: 'Total Submissions',
      value: totalSubmissionsValue,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600',
      isError: !overviewData
    },
    {
      title: 'Active Ads',
      value: activeAdsValue,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
        </svg>
      ),
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600',
      isError: !Array.isArray(ads)
    },
    {
      title: 'Conversion Rate',
      value: conversionRateValue,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      ),
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-600',
      isError: !overviewData?.journeyStats
    }
  ];

  console.log('🎯 OVERVIEW CARDS: Final cards array:', cards.map(card => ({
    title: card.title,
    value: card.value,
    isError: card.isError
  })));

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => (
        <Card key={index} className={`border-0 shadow-lg hover:shadow-xl transition-shadow duration-200 ${card.isError ? 'border-l-4 border-orange-400' : ''}`}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center space-x-2 mb-1">
                  <p className="text-sm font-medium text-gray-600">{card.title}</p>
                  {card.isError && (
                    <div className="w-4 h-4 text-orange-500" title="Data unavailable">
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                    </div>
                  )}
                </div>
                <p className={`text-2xl font-bold ${card.isError ? 'text-gray-400' : 'text-gray-900'}`}>
                  {card.value}
                </p>
              </div>
              <div className={`p-3 rounded-lg ${card.isError ? 'bg-gray-100' : card.bgColor}`}>
                <div className={`${card.isError ? 'text-gray-400' : card.textColor}`}>
                  {card.icon}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default OverviewCards;