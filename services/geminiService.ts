import { GoogleGenAI, Type, Schema } from "@google/genai";
import { AnalysisResult, Language } from "../types";

const getSystemInstruction = (lang: Language) => `
You are RenderAI, an elite Architectural Visualization Consultant. Your primary function is to interpret architectural inputs to generate professional rendering specifications and generative prompts.

### CORE OBJECTIVES
1. **Analyze Input:** Examine the provided image or sketch to strictly categorize the scene as **Interior** or **Exterior**.
2. **Deconstruct Geometry:** Identify architectural features, perspective points, and spatial composition from the visual data.
3. **Enhance Fidelity:** Apply high-end visualization terminology (e.g., 'Global Illumination', 'Ambient Occlusion', '4k Texture', 'Photorealistic') to describe the desired output.
4. **Generate Output:** Produce a detailed generative prompt optimized for engines like Midjourney, Stable Diffusion, or DALL-E 3.
5. **Motion Prompt:** Produce a detailed motion generation prompt optimized for AI video generators (like Runway, Luma, Kling) focusing on camera moves and environmental dynamics.

### LANGUAGE SETTING
The user's preferred language is: **${lang === 'ar' ? 'Arabic' : 'English'}**.

**Rules for Output:**
- **generativePrompt**: MUST ALWAYS BE IN ENGLISH, as this is for AI image generators.
- **motionPrompt**: MUST ALWAYS BE IN ENGLISH, as this is for AI video generators.
- **category**: MUST ALWAYS BE 'Interior' or 'Exterior' (English enum values).
- **suggestedEngine**: Keep in English (e.g. Unreal Engine 5).
- **features**, **perspective**, **lighting**, **materials**: Provide these descriptions in **${lang === 'ar' ? 'Arabic' : 'English'}**.

### STYLE GUIDELINES
- **Tone:** Technical, authoritative, and precise.
- **Lighting:** Always specify lighting conditions.
- **Materials:** Infer and define textures to maximize realism.
`;

const responseSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    category: {
      type: Type.STRING,
      enum: ["Interior", "Exterior"],
      description: "Strictly categorize the scene. Always use English values.",
    },
    features: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "List of identified architectural features in the requested language.",
    },
    perspective: {
      type: Type.STRING,
      description: "Description of the perspective and spatial composition in the requested language.",
    },
    lighting: {
      type: Type.STRING,
      description: "Specific lighting conditions inferred or suggested in the requested language.",
    },
    materials: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "Inferred and defined textures in the requested language.",
    },
    suggestedEngine: {
      type: Type.STRING,
      description: "Best suitable engine reference (e.g., Unreal Engine 5, V-Ray).",
    },
    generativePrompt: {
      type: Type.STRING,
      description: "The detailed generative prompt optimized for AI image generators (ALWAYS ENGLISH).",
    },
    motionPrompt: {
      type: Type.STRING,
      description: "A detailed motion video generation prompt focused on camera movement and environment dynamics (ALWAYS ENGLISH).",
    },
  },
  required: ["category", "features", "perspective", "lighting", "materials", "suggestedEngine", "generativePrompt", "motionPrompt"],
};

export const analyzeImage = async (base64Image: string, mimeType: string, lang: Language): Promise<AnalysisResult> => {
  const customKey = localStorage.getItem('customGeminiKey');
  const apiKey = customKey || process.env.API_KEY || process.env.GEMINI_API_KEY;
  
  if (!apiKey) {
    throw new Error("API Key is missing via process.env.API_KEY");
  }

  const ai = new GoogleGenAI({ apiKey });
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview', 
      config: {
        systemInstruction: getSystemInstruction(lang),
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.4,
      },
      contents: [
        {
          role: "user",
          parts: [
            {
              inlineData: {
                mimeType: mimeType,
                data: base64Image,
              },
            },
            {
              text: `Analyze this architectural image and generate a rendering specification. Output language: ${lang}.`,
            },
          ],
        },
      ],
    });

    const text = response.text;
    if (!text) {
      throw new Error("No response generated");
    }

    return JSON.parse(text) as AnalysisResult;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};
