import axios from 'axios';

const BASE_URL = 'https://rxnav.nlm.nih.gov/REST';

// Function to search for drugs by name
export const searchDrugs = async (drugName) => {
  try {
    const response = await axios.get(`${BASE_URL}/drugs.json?name=${drugName}`);
    return response.data.drugGroup?.conceptGroup || [];
  } catch (error) {
    console.error('Error fetching drug data:', error);
    return [];
  }
};

// Function to get suggested drugs
export const suggestDrugs = async (partialName) => {
  try {
    const response = await axios.get(`${BASE_URL}/spellingsuggestions.json?name=${partialName}`);
    return response.data.suggestionGroup?.suggestionList?.suggestion || [];
  } catch (error) {
    console.error('Error fetching suggestions:', error);
    return [];
  }
};

// Function to find RxCUI by ID
export const findRxcuiById = async (id) => {
  try {
    const response = await axios.get(`${BASE_URL}/rxcui/${id}.json`);
    return response.data.rxnormId?.rxcui || null;
  } catch (error) {
    console.error('Error fetching RxCUI by ID:', error);
    return null;
  }
};

// Function to get drugs by RxCUI
export const getDrugs = async (rxcui) => {
  try {
    const response = await axios.get(`${BASE_URL}/rxcui/${rxcui}/properties.json`);
    return response.data.properties || null;
  } catch (error) {
    console.error('Error fetching drugs by RxCUI:', error);
    return null;
  }
};

// Function to get Rx Concept Properties
export const getRxConceptProperties = async (rxcui) => {
  try {
    const response = await axios.get(`${BASE_URL}/rxcui/${rxcui}/concept.json`);
    return response.data.conceptProperties || [];
  } catch (error) {
    console.error('Error fetching Rx Concept Properties:', error);
    return [];
  }
};
