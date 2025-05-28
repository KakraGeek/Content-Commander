import chalk from 'chalk';

/**
 * Handles API errors with detailed logging and user-friendly messages
 * @param {Error} error - The error object from the API call
 * @param {string} serviceName - Name of the service that encountered the error
 */
function handleApiError(error, serviceName) {
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    const status = error.response.status;
    const statusText = error.response.statusText;
    const data = error.response.data;
    
    console.error(chalk.red(`${serviceName} API Error (${status} ${statusText})`));
    
    if (status === 401 || status === 403) {
      console.error(chalk.yellow('Authentication or authorization error.'));
      console.log('Please check your API keys in the configuration.');
      console.log('Run: content-commander setup');
    } else if (status === 404) {
      console.error(chalk.yellow('Resource not found.'));
    } else if (status === 429) {
      console.error(chalk.yellow('Rate limit exceeded.'));
      console.log('Please try again later.');
    } else if (status >= 500) {
      console.error(chalk.yellow('Server error. Please try again later.'));
    }
    
    if (data && data.error) {
      console.error('Error details:', data.error.message || data.error);
    }
  } else if (error.request) {
    // The request was made but no response was received
    console.error(chalk.red(`${serviceName} API Error: No response received`));
    console.error('This could be due to network issues or service unavailability.');
  } else {
    // Something happened in setting up the request that triggered an Error
    console.error(chalk.red(`${serviceName} API Error: ${error.message}`));
  }
  
  // Suggestion for next steps
  console.log('\nSuggestions:');
  console.log('- Check your internet connection');
  console.log('- Verify API configuration: content-commander setup');
  console.log('- Try again later if it\'s a rate limit or server issue');
}

export default handleApiError; 