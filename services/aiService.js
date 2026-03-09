const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const askAI = async (prompt) => {
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: "You are a business analytics assistant." },
      { role: "user", content: prompt }
    ],
  });

  return response.choices[0].message.content;
};

module.exports = {
  askAI
};