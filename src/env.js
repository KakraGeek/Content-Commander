// Minimal environment configuration
import { config } from 'dotenv';
import chalk from 'chalk';

// Load environment variables
config();

// Simple environment getter
function getEnv(key, defaultValue = null) {
  return process.env[key] ?? defaultValue;
}

// Provider functions
const openaiApiKey = () => getEnv('OPENAI_API_KEY');
const anthropicApiKey = () => getEnv('ANTHROPIC_API_KEY');
const defaultAiProvider = () => getEnv('DEFAULT_AI_PROVIDER', 'openai');

export {
  openaiApiKey,
  anthropicApiKey,
  defaultAiProvider
}; 