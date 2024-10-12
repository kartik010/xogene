import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { suggestDrugs } from '../services/rxnormAPI';

function DrugSearch() {
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleInputChange = async (e) => {
    const value = e.target.value;
    setSearchQuery(value);

    if (value.length > 0) {  // Trigger suggestion starting from the first letter
      try {
        const drugSuggestions = await suggestDrugs(value);
        if (drugSuggestions.length > 0) {
          setSuggestions(drugSuggestions);
          setError(''); // Clear error if suggestions are found
        } else {
          setError('No suggestions found');
          setSuggestions([]);  // Clear previous suggestions if no match
        }
      } catch (error) {
        setError('Error fetching suggestions');
        console.error(error);
        setSuggestions([]);  // Clear suggestions in case of an error
      }
    } else {
      setSuggestions([]);
      setError('');  // Clear error if input is cleared
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery) {
      if (suggestions.length > 0) {
        navigate(`/drugs/${searchQuery}`);
      } else {
        setError('No results found for the entered drug name.');
      }
    }
  };

  return (
    <div className="search-container">
      <header className="header">
        <h1 className="logo">Xogene</h1>
        <h2>Search Drugs</h2>
      </header>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Search drug name"
          value={searchQuery}
          onChange={handleInputChange}
        />
        <button type="submit">Search</button>
        {suggestions.length > 0 && (
          <ul>
            {suggestions.map((suggestion, index) => (
              <li key={index} onClick={() => setSearchQuery(suggestion)}>
                {suggestion}
              </li>
            ))}
          </ul>
        )}
        {error && <p className="error">{error}</p>}
      </form>
    </div>
  );
}

export default DrugSearch;
