import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { searchDrugs, suggestDrugs, getDrugs, getRxConceptProperties } from '../services/rxnormAPI';

function DrugInfo() {
  const { drug_name } = useParams();
  const [drugInfo, setDrugInfo] = useState([]);
  const [relatedNDCs, setRelatedNDCs] = useState({});
  const [error, setError] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    const fetchDrugInfo = async () => {
      const data = await searchDrugs(drug_name);

      if (data.length > 0) {
        setDrugInfo(data);
        setError('');

        // Fetch details for each drug's RxCUI
        data.forEach(async (group) => {
          const conceptProperties = group.conceptProperties || []; // Default to an empty array if undefined
          const rxcui = conceptProperties[0]?.rxcui; // Safely access rxcui

          if (rxcui) {
            const drugs = await getDrugs(rxcui);
            const properties = await getRxConceptProperties(rxcui);

            // Store NDCs if properties exist
            const ndcs = properties.map(prop => prop.ndc).join(', ');
            setRelatedNDCs(prev => ({
              ...prev,
              [rxcui]: ndcs || 'No related NDCs found',
            }));
          }
        });
      } else {
        const suggestedDrugs = await suggestDrugs(drug_name);
        if (suggestedDrugs.length > 0) {
          setSuggestions(suggestedDrugs);
          setError(`No exact match found. Did you mean: ${suggestedDrugs.join(', ')}?`);
        } else {
          setError('No information found for this drug.');
        }
      }
    };

    fetchDrugInfo();
  }, [drug_name]);

  return (
    <div className="drug-info-container">
      <h1>Drug Information for {drug_name}</h1>
      {error ? (
        <p>{error}</p>
      ) : (
        <ul>
          {drugInfo.map((group, index) => {
            const conceptProperties = group.conceptProperties || []; // Default to an empty array if undefined
            return (
              <li key={index}>
                {conceptProperties.length > 0 && (
                  <>
                    <strong>{conceptProperties[0].name}</strong>
                    <p><strong>RxCUI:</strong> {conceptProperties[0].rxcui}</p>
                    <p><strong>TTY:</strong> {conceptProperties[0].tty}</p>

                    {/* Display related NDCs */}
                    <p><strong>Related NDCs:</strong> {relatedNDCs[conceptProperties[0].rxcui] || 'Loading...'}</p>
                  </>
                )}
              </li>
            );
          })}
        </ul>
      )}
      {suggestions.length > 0 && (
        <div>
          <p>Suggested alternatives:</p>
          <ul>
            {suggestions.map((suggestion, index) => (
              <li key={index}>{suggestion}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default DrugInfo;
