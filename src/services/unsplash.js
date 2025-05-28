import axios from 'axios';
import configUtil from '../config.js';

const UNSPLASH_API_URL = 'https://api.unsplash.com';

async function searchPhotos(query, page = 1, perPage = 10) {
  const accessKey = configUtil.get('apis.unsplash.accessKey');
  
  if (!accessKey) {
    throw new Error('Unsplash API key not found. Please run "content-commander setup" to configure your API key.');
  }

  try {
    const response = await axios.get(`${UNSPLASH_API_URL}/search/photos`, {
      headers: {
        'Authorization': `Client-ID ${accessKey}`
      },
      params: {
        query,
        page,
        per_page: perPage
      }
    });

    return response.data;
  } catch (error) {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      throw new Error(`Unsplash API error: ${error.response.data.errors.join(', ')}`);
    } else if (error.request) {
      // The request was made but no response was received
      throw new Error('No response from Unsplash API. Please check your internet connection.');
    } else {
      // Something happened in setting up the request that triggered an Error
      throw new Error(`Error making request to Unsplash API: ${error.message}`);
    }
  }
}

export default {
  searchPhotos
}; 