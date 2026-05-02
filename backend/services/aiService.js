const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

const getChatResponse = async (history, message) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const chat = model.startChat({
      history: history || [],
      generationConfig: {
        maxOutputTokens: 500,
      },
    });

    const result = await chat.sendMessage(message);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Gemini AI Error:", error);
    throw new Error("Failed to get AI response");
  }
};

const simulateScenario = async (scenario) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `You are an Indian election expert. Simulate a scenario for a voter: ${scenario}. 
    Provide step-by-step guidance on what they should do in this situation, keeping it simple and official.`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Gemini Scenario Error:", error);
    throw new Error("Failed to simulate scenario");
  }
};

module.exports = {
  getChatResponse,
  simulateScenario,
};
