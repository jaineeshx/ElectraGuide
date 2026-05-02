const { TranslationServiceClient } = require('@google-cloud/translate');

const translationClient = new TranslationServiceClient();
const projectId = process.env.FIREBASE_PROJECT_ID; // Usually the same as Google Project ID
const location = 'global';

const translateText = async (text, targetLanguage) => {
  if (!text) return '';
  if (targetLanguage === 'en') return text;

  try {
    const request = {
      parent: `projects/${projectId}/locations/${location}`,
      contents: [text],
      mimeType: 'text/plain',
      targetLanguageCode: targetLanguage,
    };

    const [response] = await translationClient.translateText(request);
    return response.translations[0].translatedText;
  } catch (error) {
    console.error('Translation Error:', error);
    // Fallback to original text if translation fails
    return text;
  }
};

module.exports = {
  translateText,
};
