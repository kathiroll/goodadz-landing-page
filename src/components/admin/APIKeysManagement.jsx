import { useState } from 'react';
import APIKeysTable from './APIKeysTable';
import APIKeyDetail from './APIKeyDetail';

const APIKeysManagement = () => {
  const [selectedApiKey, setSelectedApiKey] = useState(null);
  const [view, setView] = useState('list'); // 'list' or 'detail'

  const handleSelectApiKey = (apiKey) => {
    console.log('🔍 Selecting API key for details:', apiKey);
    setSelectedApiKey(apiKey);
    setView('detail');
  };

  const handleBackToList = () => {
    console.log('⬅️ Going back to API keys list');
    setSelectedApiKey(null);
    setView('list');
  };

  return (
    <div className="space-y-6">
      {view === 'list' ? (
        <APIKeysTable onSelectApiKey={handleSelectApiKey} />
      ) : (
        <APIKeyDetail 
          apiKey={selectedApiKey} 
          onBack={handleBackToList} 
        />
      )}
    </div>
  );
};

export default APIKeysManagement;
