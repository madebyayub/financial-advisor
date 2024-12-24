require('dotenv').config();

module.exports = {
  apiKey: process.env.OPENAI_API_KEY,
  models: {
    analysis: "gpt-4o-mini",  // for document analysis
    advisor: "gpt-4o-mini"    // for financial advice
  }
}; 