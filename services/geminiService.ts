import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const summarizeContent = async (text: string, platform: string): Promise<string> => {
  if (!apiKey) {
    return "API Key is missing. Please configure process.env.API_KEY.";
  }

  try {
    const prompt = `
      You are an expert content curator. 
      Summarize the following ${platform} content into a concise, 2-sentence insight. 
      Capture the main point and any key opinion or fact.
      
      Content: "${text}"
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget: 0 } // Fast response needed for UI
      }
    });

    return response.text || "Could not generate summary.";
  } catch (error) {
    console.error("Gemini summarization failed:", error);
    return "Failed to generate summary. Please try again later.";
  }
};

export const generateBriefing = async (titles: string[]): Promise<string> => {
   if (!apiKey) return "API Key missing.";
   
   try {
     const prompt = `
      Here are the latest headlines from the user's RSS feed:
      ${titles.join('\n- ')}
      
      Provide a "Morning Briefing" style paragraph (max 100 words) synthesizing the overall mood and key topics of these headlines.
     `;
     
     const response = await ai.models.generateContent({
       model: 'gemini-3-flash-preview',
       contents: prompt,
     });
     
     return response.text || "No briefing available.";
   } catch (error) {
     return "Could not generate briefing.";
   }
};