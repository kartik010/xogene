import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DrugSearch from './components/DrugSearch';
import DrugInfo from './components/DrugInfo';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<DrugSearch />} />
        <Route path="/drugs/:drug_name" element={<DrugInfo />} />
      </Routes>
    </Router>
  );
}

export default App;
