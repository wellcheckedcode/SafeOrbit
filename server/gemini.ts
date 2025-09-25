import * as fs from "fs";
import { GoogleGenAI } from "@google/genai";

// TODO: remove mock functionality when GEMINI_API_KEY is provided
// Using Google Gemini AI integration
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "mock-key" });

export async function analyzeEmergencyImage(jpegImagePath: string, location?: { lat: number; lng: number }): Promise<string> {
  try {
    // TODO: remove mock functionality when API key is available
    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === "mock-key") {
      return `MOCK ANALYSIS: Emergency situation detected at location ${location ? `${location.lat}, ${location.lng}` : 'unknown location'}. Image analysis would be performed here with Gemini AI. Please set GEMINI_API_KEY to enable real analysis.`;
    }

    if (!fs.existsSync(jpegImagePath)) {
      throw new Error(`Image file not found: ${jpegImagePath}`);
    }

    const imageBytes = fs.readFileSync(jpegImagePath);
    
    const locationContext = location ? `Location coordinates: ${location.lat}, ${location.lng}. ` : '';
    
    const prompt = `${locationContext}This is an emergency situation image. Analyze this image in detail and provide:
1. Description of what you can see
2. Any potential safety concerns or hazards
3. Context that might be relevant for emergency responders
4. Suggestions for immediate actions if any
Please be concise but thorough in your analysis.`;

    const contents = [
      {
        inlineData: {
          data: imageBytes.toString("base64"),
          mimeType: "image/jpeg",
        },
      },
      prompt,
    ];

    const response = await ai.models.generateContent({
      model: "gemini-2.5-pro",
      contents: contents,
    });

    return response.text || "Unable to analyze image at this time.";
  } catch (error) {
    console.error('Error analyzing emergency image:', error);
    return `Error analyzing image: ${error instanceof Error ? error.message : 'Unknown error'}`;
  }
}

export async function analyzeEmergencyAudio(audioPath: string): Promise<string> {
  try {
    // TODO: remove mock functionality when API key is available
    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === "mock-key") {
      return "MOCK ANALYSIS: Audio analysis would be performed here with Gemini AI. Emergency audio content analysis not available without API key.";
    }

    // Note: Gemini doesn't directly support audio analysis in the current SDK
    // This would need to be implemented with speech-to-text first
    return "Audio analysis feature coming soon. Please use image capture for now.";
  } catch (error) {
    console.error('Error analyzing audio:', error);
    return `Error analyzing audio: ${error instanceof Error ? error.message : 'Unknown error'}`;
  }
}

export async function generateEmergencySummary(
  imageAnalysis: string, 
  location: { lat: number; lng: number },
  userProfile?: { name: string; phone?: string }
): Promise<string> {
  try {
    // TODO: remove mock functionality when API key is available
    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === "mock-key") {
      const mockSummary = `EMERGENCY ALERT - MOCK ANALYSIS
Location: ${location.lat}, ${location.lng}
${userProfile ? `Person: ${userProfile.name}${userProfile.phone ? ` (${userProfile.phone})` : ''}` : 'Identity unknown'}
Situation: ${imageAnalysis}
Time: ${new Date().toLocaleString()}
This is a mock emergency summary. Real AI analysis requires GEMINI_API_KEY.`;
      return mockSummary;
    }

    const prompt = `Create a concise emergency summary based on the following information:
Location: ${location.lat}, ${location.lng}
${userProfile ? `Person in need: ${userProfile.name}${userProfile.phone ? ` (Phone: ${userProfile.phone})` : ''}` : ''}
Image Analysis: ${imageAnalysis}
Current Time: ${new Date().toLocaleString()}

Please format this as a clear, urgent emergency alert that can be sent to emergency contacts. Include key details and location coordinates.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    return response.text || "Unable to generate emergency summary.";
  } catch (error) {
    console.error('Error generating emergency summary:', error);
    return `Emergency situation detected at ${location.lat}, ${location.lng}. Unable to generate detailed summary.`;
  }
}