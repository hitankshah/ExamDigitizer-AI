import { GoogleGenAI, Type, Schema } from "@google/genai";
import { ExamQuestion } from "../types";

const SYSTEM_PROMPT = `
You are an expert Optical Mark Recognition (OMR) and Exam Digitization AI. Your task is to act as an "Exam Creator" by processing the attached PDF exam paper images.

### GOAL
Extract every multiple-choice question and, CRITICALLY, extract the correct answer key so the system can grade the user's attempt later.

### INPUT ANALYSIS
1. Scan all provided images (pages of the exam).
2. Identify all multiple-choice questions.
3. **FIND THE ANSWERS**: 
   - Look specifically at the end of the document for an "Answer Key", "Marking Scheme", or "Solutions" table. This is the most common location.
   - Look for inline markings (bolded options, ticks, circles, asterisks).
   - If you find an Answer Key table (e.g., "1. B, 2. C..."), map these accurately to the corresponding Question IDs.
   - If absolutely no answer is indicated in the document, set 'correctAnswer' to null.

### EXTRACTION RULES
1. **ID**: Use the question number printed in the document (e.g., "1", "1.", "Q1").
2. **Text**: Extract the question text cleanly. Remove newlines or formatting artifacts.
3. **Options**: Extract options (A, B, C, D). 
4. **Correct Answer**: 
   - Must be "A", "B", "C", or "D".
   - This is vital for the auto-grading feature.

### JSON OUTPUT ONLY
Return ONLY the valid JSON array.
`;

export const analyzeExamImages = async (base64Images: string[]): Promise<ExamQuestion[]> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("System configuration error: API Key is missing.");
  }

  if (!base64Images || base64Images.length === 0) {
      throw new Error("No image data provided for analysis.");
  }

  const ai = new GoogleGenAI({ apiKey });

  // Prepare content parts
  const parts = base64Images.map((img) => {
    // Strip the data:image/jpeg;base64, prefix if present
    const data = img.includes(',') ? img.split(',')[1] : img;
    return {
      inlineData: {
        mimeType: 'image/jpeg',
        data: data,
      },
    };
  });

  // Add the text prompt
  parts.push({
    text: "Extract all questions and the answer key from these exam pages."
  } as any);

  // Define the strict response schema
  const responseSchema: Schema = {
    type: Type.ARRAY,
    description: "List of extracted multiple choice questions with answers",
    items: {
      type: Type.OBJECT,
      properties: {
        id: { type: Type.STRING, description: "The question number" },
        question: { type: Type.STRING, description: "The text of the question" },
        options: {
          type: Type.OBJECT,
          description: "The multiple choice options",
          properties: {
            A: { type: Type.STRING },
            B: { type: Type.STRING },
            C: { type: Type.STRING },
            D: { type: Type.STRING }
          },
          required: ["A", "B", "C", "D"]
        },
        correctAnswer: { 
          type: Type.STRING, 
          description: "The correct answer key (A, B, C, D) found in the document/key",
          nullable: true,
          enum: ["A", "B", "C", "D"]
        }
      },
      required: ["id", "question", "options"]
    }
  };

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        role: 'user',
        parts: parts as any
      },
      config: {
        systemInstruction: SYSTEM_PROMPT,
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.1, // Low temperature for factual extraction
      }
    });

    if (!response || !response.text) {
        // Check for safety blocks or other reasons
        if (response.candidates && response.candidates.length > 0) {
            const candidate = response.candidates[0];
            if (candidate.finishReason === 'SAFETY') {
                throw new Error("The content was blocked by safety filters. Please review the document for sensitive material.");
            }
            if (candidate.finishReason === 'OTHER') {
                throw new Error("AI processing stopped unexpectedly. Please try again.");
            }
        }
        throw new Error("AI returned an empty response. Please try again with a clearer image.");
    }

    const jsonText = response.text;

    try {
        const parsedData = JSON.parse(jsonText);
        
        if (!Array.isArray(parsedData)) {
            throw new Error("AI response was not in the expected format (Array).");
        }
        
        if (parsedData.length === 0) {
            throw new Error("No questions were detected. Ensure the PDF contains clearly formatted multiple-choice questions.");
        }

        return parsedData as ExamQuestion[];

    } catch (parseError) {
        console.error("JSON Parse Error:", parseError, "Raw Response:", jsonText);
        throw new Error("Failed to interpret the AI results. The document structure might be too complex or unclear.");
    }

  } catch (error: any) {
    console.error("Gemini Analysis Error:", error);
    
    const msg = error.message || '';

    // Handle common API errors with friendly messages
    if (msg.includes('401') || msg.includes('API key')) {
        throw new Error("Authentication failed: Invalid API Key. Please check your configuration.");
    }
    if (msg.includes('429') || msg.includes('Quota') || msg.includes('Resource exhausted')) {
        throw new Error("Service quota exceeded. Please try again later.");
    }
    if (msg.includes('503') || msg.includes('Overloaded')) {
        throw new Error("AI Service is temporarily overloaded. Please wait a moment and try again.");
    }
    
    // Pass through specific logical errors thrown above
    if (msg.includes('safety filters') || msg.includes('No questions') || msg.includes('AI response')) {
        throw error;
    }

    throw new Error(`AI Analysis failed: ${msg}`);
  }
};