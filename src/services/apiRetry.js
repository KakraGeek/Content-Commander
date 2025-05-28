import chalk from 'chalk';

/**
 * Retry utility for API calls with exponential backoff
 * @param {Function} fn - Async function to retry
 * @param {Object} options - Retry options
 * @param {number} [options.maxRetries=3] - Maximum number of retry attempts
 * @param {number} [options.retryDelay=1000] - Base delay between retries in milliseconds
 * @param {number[]} [options.retryOn=[408, 429, 500, 502, 503, 504]] - HTTP status codes to retry on
 * @param {string} [options.name='API'] - Name of the service for logging
 * @returns {Promise<any>} - Result of the function call
 */
async function withRetry(fn, options = {}) {
  const {
    maxRetries = 3,
    retryDelay = 1000,
    retryOn = [408, 429, 500, 502, 503, 504],
    name = 'API'
  } = options;
  
  let lastError;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      
      // Check if error is retryable
      const status = error.response?.status;
      const isRetryable = retryOn.includes(status) || !status;
      
      if (!isRetryable || attempt === maxRetries) {
        throw error;
      }
      
      console.log(chalk.yellow(`${name} request failed. Retrying (${attempt}/${maxRetries})...`));
      
      // Wait before retrying with exponential backoff
      await new Promise(resolve => setTimeout(resolve, retryDelay * attempt));
    }
  }
  
  throw lastError;
}

export default withRetry; 