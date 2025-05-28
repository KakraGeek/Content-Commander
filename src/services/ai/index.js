import chalk from 'chalk';
import { defaultAiProvider } from '../../env.js';
import openaiService from './openai.js';

function getProvider() {
  const provider = defaultAiProvider();
  console.log(`Using ${provider} as AI provider`);
  if (provider === 'openai') return openaiService;
  // You can add anthropicService here later
  return openaiService;
}

async function generateCompletion(prompt) {
  const provider = getProvider();
  console.log(chalk.dim('Generating completion...'));
  return await provider.generateCompletion(prompt);
}

export { generateCompletion };