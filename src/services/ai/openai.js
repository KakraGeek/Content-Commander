// Minimal OpenAI service
import { openaiApiKey } from '../../env.js';
import axios from 'axios';

class OpenAIService {
  constructor() {
    this.apiKey = openaiApiKey();
    this.baseUrl = 'https://api.openai.com/v1';
  }

  async generateCompletion(prompt) {
    if (!this.apiKey) {
      return {
        success: false,
        error: 'OpenAI API key not configured. Run: content-commander setup'
      };
    }

    try {
      const response = await axios.post(
        `${this.baseUrl}/chat/completions`,
        {
          model: 'gpt-3.5-turbo',
          messages: [
            { role: 'system', content: 'You are a helpful assistant.' },
            { role: 'user', content: prompt }
          ]
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.apiKey}`
          }
        }
      );

      return {
        success: true,
        data: response.data.choices[0].message.content.trim()
      };
    } catch (error) {
      console.error('OpenAI API Error:', error.message);
      return {
        success: false,
        error: 'Failed to generate completion. See console for details.'
      };
    }
  }
}

// Export a singleton instance
const openaiService = new OpenAIService();
export default openaiService; 