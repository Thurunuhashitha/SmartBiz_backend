const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const { getConnection } = require('../db/db-connection');
const connection = getConnection();

const askAI = async (prompt, companyId = null, featureType = 'general') => {
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: "You are a business analytics assistant." },
      { role: "user", content: prompt }
    ],
  });

  const content = response.choices[0].message.content;
  const promptTokens = response.usage.prompt_tokens;
  const completionTokens = response.usage.completion_tokens;

  // Log AI usage asynchronously
  const query = 'INSERT INTO ai_usage (company_id, feature_type, prompt_tokens, completion_tokens, request_details) VALUES (?, ?, ?, ?, ?)';
  connection.query(query, [companyId, featureType, promptTokens, completionTokens, prompt.substring(0, 1000)], (err) => {
    if (err) console.error('Error logging AI usage:', err);
  });

  return content;
};

module.exports = {
  askAI
};