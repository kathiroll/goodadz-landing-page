import { Card, CardContent } from '../ui/card';

const ConversionFunnel = ({ journeyStats }) => {
  console.log('🎯 CONVERSION FUNNEL: Component rendered with props:', {
    journeyStatsExists: !!journeyStats,
    journeyStatsType: typeof journeyStats,
    journeyStats: journeyStats
  });

  if (!journeyStats || Object.keys(journeyStats).length === 0) {
    console.log('🎯 CONVERSION FUNNEL: No journey stats provided, showing unavailable message');
    return (
      <Card className="border-l-4 border-orange-400">
        <CardContent className="p-6 text-center">
          <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Conversion Data Unavailable</h3>
          <p className="text-gray-500 mb-4">Unable to load conversion funnel data from the overview API.</p>
          <p className="text-sm text-gray-400">This could be due to API connectivity issues or missing data.</p>
        </CardContent>
      </Card>
    );
  }

  const { widgetShownCount, adSelectedCount, formSubmittedCount } = journeyStats;

  console.log('🎯 CONVERSION FUNNEL: Journey stats values:', {
    widgetShownCount: {
      raw: widgetShownCount,
      type: typeof widgetShownCount,
      isNumber: typeof widgetShownCount === 'number'
    },
    adSelectedCount: {
      raw: adSelectedCount,
      type: typeof adSelectedCount,
      isNumber: typeof adSelectedCount === 'number'
    },
    formSubmittedCount: {
      raw: formSubmittedCount,
      type: typeof formSubmittedCount,
      isNumber: typeof formSubmittedCount === 'number'
    }
  });

  // Calculate drop-off percentages
  const adSelectedRate = widgetShownCount > 0 ? (adSelectedCount / widgetShownCount) * 100 : 0;
  const formSubmittedRate = adSelectedCount > 0 ? (formSubmittedCount / adSelectedCount) * 100 : 0;
  const overallConversionRate = widgetShownCount > 0 ? (formSubmittedCount / widgetShownCount) * 100 : 0;

  console.log('🎯 CONVERSION FUNNEL: Calculated rates:', {
    adSelectedRate: {
      calculation: `(${adSelectedCount} / ${widgetShownCount}) * 100`,
      result: adSelectedRate,
      formatted: `${adSelectedRate.toFixed(1)}%`
    },
    formSubmittedRate: {
      calculation: `(${formSubmittedCount} / ${adSelectedCount}) * 100`,
      result: formSubmittedRate,
      formatted: `${formSubmittedRate.toFixed(1)}%`
    },
    overallConversionRate: {
      calculation: `(${formSubmittedCount} / ${widgetShownCount}) * 100`,
      result: overallConversionRate,
      formatted: `${overallConversionRate.toFixed(2)}%`
    }
  });

  const funnelSteps = [
    {
      title: 'Widget Shown',
      count: widgetShownCount,
      percentage: 100,
      color: 'bg-blue-500',
      dropOff: 0
    },
    {
      title: 'Ad Selected',
      count: adSelectedCount,
      percentage: adSelectedRate,
      color: 'bg-green-500',
      dropOff: 100 - adSelectedRate
    },
    {
      title: 'Form Submitted',
      count: formSubmittedCount,
      percentage: formSubmittedRate,
      color: 'bg-purple-500',
      dropOff: 100 - formSubmittedRate
    }
  ];

  console.log('🎯 CONVERSION FUNNEL: Funnel steps created:', funnelSteps.map(step => ({
    title: step.title,
    count: step.count,
    percentage: step.percentage,
    dropOff: step.dropOff
  })));

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Conversion Funnel Analysis</h3>
          
          {/* Overall Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-2xl font-bold text-blue-600">{widgetShownCount.toLocaleString()}</p>
              <p className="text-sm text-gray-600">Total Widget Views</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-2xl font-bold text-green-600">{adSelectedCount.toLocaleString()}</p>
              <p className="text-sm text-gray-600">Ad Selections</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <p className="text-2xl font-bold text-purple-600">{formSubmittedCount.toLocaleString()}</p>
              <p className="text-sm text-gray-600">Form Submissions</p>
            </div>
          </div>

          {/* Funnel Visualization */}
          <div className="space-y-4">
            {funnelSteps.map((step, index) => (
              <div key={index} className="relative">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <div className={`w-4 h-4 rounded-full ${step.color}`}></div>
                    <span className="font-medium text-gray-900">{step.title}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-semibold text-gray-900">{step.count.toLocaleString()}</span>
                    <span className="text-sm text-gray-500 ml-2">({step.percentage.toFixed(1)}%)</span>
                  </div>
                </div>
                
                {/* Progress Bar */}
                <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                  <div
                    className={`h-3 rounded-full ${step.color} transition-all duration-500`}
                    style={{ width: `${step.percentage}%` }}
                  ></div>
                </div>

                {/* Drop-off Indicator */}
                {index > 0 && step.dropOff > 0 && (
                  <div className="text-right">
                    <span className="text-sm text-red-600">
                      -{step.dropOff.toFixed(1)}% drop-off
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="mt-8 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="font-medium text-gray-900">Overall Conversion Rate</span>
              <span className="text-xl font-bold text-gray-900">
                {overallConversionRate.toFixed(2)}%
              </span>
            </div>
            <p className="text-sm text-gray-600 mt-1">
              From widget shown to form submission
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ConversionFunnel;