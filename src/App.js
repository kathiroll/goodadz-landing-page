import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import GoodAdsLandingPage from './GoodAdsLandingPage';
import AdminPage from './components/AdminPage';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<GoodAdsLandingPage />} />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App; 