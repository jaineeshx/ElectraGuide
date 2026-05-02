const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config({ path: 'backend/.env' });

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

async function listModels() {
  try {
    const result = await genAI.listModels();
    console.log(JSON.stringify(result, null, 2));
  } catch (error) {
    console.error("Error listing models:", error);
  }
}

listModels();
