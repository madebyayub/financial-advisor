const { OpenAI } = require('openai');
const config = require('../config');
const prompts = require('../config/prompts');

class AdvisorAgent {
  constructor() {
    this.client = new OpenAI({
      apiKey: config.apiKey,
      model: config.models.advisor
    });
  }

  async provideAdvice(userData) {
    try {
      console.log(userData);
      const response = await this.client.chat.completions.create({
        model: config.models.advisor,
        messages: [
          { role: "system", content: prompts.financialAdvisor.system },
          { role: "system", content: `User's financial document analysis:\n${userData.documentAnalysis}` },
          { role: "user", content: userData.lastMessage }
        ],
      });

      return {
        advice: response.choices[0].message.content,
        timestamp: new Date(),
        status: 'success'
      };
    } catch (error) {
      console.error('Advice generation error:', error);
      throw new Error('Failed to generate advice');
    }
  }
}

module.exports = new AdvisorAgent(); 