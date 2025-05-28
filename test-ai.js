// Test AI service
import { generateCompletion } from './src/services/ai/index.js';

async function test() {
  try {
    console.log('Testing AI service...');
    const result = await generateCompletion('Hello');
    console.log('Result:', result);
  } catch (error) {
    console.error('Error:', error);
  }
}

test(); 