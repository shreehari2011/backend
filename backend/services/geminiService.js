const axios = require('axios');

const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent`;

async function callGemini(prompt) {
  const response = await axios.post(
    `${GEMINI_URL}?key=${process.env.GEMINI_API_KEY}`,
    {
      contents: [{ parts: [{ text: prompt }] }]
    },
    {
      headers: { 'Content-Type': 'application/json' }
    }
  );
  return response.data.candidates[0].content.parts[0].text;
}

async function generateTasks(goal) {
  const prompt = `Generate 5 productivity tasks for: ${goal}.
Return ONLY a valid JSON array with no markdown, no backticks, no explanation.
Each object must have exactly these fields: title (string), xp (number between 1 and 30).
Example: [{"title":"Task name","xp":15}]`;

  const raw = await callGemini(prompt);
  const cleaned = raw.replace(/```json|```/gi, '').trim();
  return JSON.parse(cleaned);
}

async function generateMotivation() {
  const prompt = `Give a short motivational quote for productivity app users. Return only the quote, no extra text.`;
  return await callGemini(prompt);
}

async function analyzeProductivity(tasks) {
  const prompt = `Analyze productivity based on completed tasks:
${tasks}
Return short actionable insights in plain text. No markdown, no bullet formatting.`;
  return await callGemini(prompt);
}

module.exports = { callGemini, generateTasks, generateMotivation, analyzeProductivity };
