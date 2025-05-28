import { config } from 'dotenv';
import chalk from 'chalk';

// Load environment variables from .env file
config();

/**
 * Get an environment variable with optional default value and required flag
 * @param {string} key - The environment variable key
 * @param {any} [defaultValue=null] - Default value if key is not set
 * @param {boolean} [isRequired=false] - Whether the variable is required
 * @returns {string|null} The environment variable value or default
 */
function getEnv(key, defaultValue = null, isRequired = false) {
  const value = process.env[key] ?? defaultValue;
  
  if (isRequired && !value) {
    console.error(chalk.red(`Error: Required environment variable ${key} is not set.`));
    console.log(`Please set it in your .env file or as an environment variable.`);
    console.log(`Run: content-commander setup`);
    process.exit(1); // Exit if required variable is missing
  }
  
  return value;
}

/**
 * Validate required environment variables based on the selected AI provider
 * @throws {Error} If required variables are missing
 */
function validateEnv() {
  const provider = getEnv('DEFAULT_AI_PROVIDER', 'openai');
  
  if (provider === 'openai') {
    getEnv('OPENAI_API_KEY', null, true);
  } else if (provider === 'anthropic') {
    getEnv('ANTHROPIC_API_KEY', null, true);
  }
}

// OpenAI
const openaiApiKey = () => getEnv('OPENAI_API_KEY');

// Anthropic
const anthropicApiKey = () => getEnv('ANTHROPIC_API_KEY');

// Unsplash
const unsplashAccessKey = () => getEnv('UNSPLASH_ACCESS_KEY');

// Default settings
const defaultAiProvider = () => getEnv('DEFAULT_AI_PROVIDER', 'openai');

export {
  getEnv,
  validateEnv,
  openaiApiKey,
  anthropicApiKey,
  unsplashAccessKey,
  defaultAiProvider
}; 