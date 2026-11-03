import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import DetectionTool from './pages/DetectionTool';
import ResultsPage from './pages/ResultsPage';
import AboutDiabetes from './pages/AboutDiabetes';
import CausesEffects from './pages/CausesEffects';
import DiabetesTypes from './pages/DiabetesTypes';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50">
        <Navigation />
        <main>
          <Routes>
            <Route path="/" element={<DetectionTool />} />
            <Route path="/results" element={<ResultsPage />} />
            <Route path="/about-diabetes" element={<AboutDiabetes />} />
            <Route path="/causes-effects" element={<CausesEffects />} />
            <Route path="/types" element={<DiabetesTypes />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;