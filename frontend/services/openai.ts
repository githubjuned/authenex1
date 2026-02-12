import { Language } from '../types';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001';
const BACKEND_URL = `${API_BASE}/api`;

export class OpenAIService {
    // No headers needed for proxy (unless we add auth later)

    static async chat(message: string, history: { role: 'user' | 'assistant', content: string }[], language: Language): Promise<string> {
        const languageMap: Record<Language, string> = {
            en: "English (Indian Context)",
            hi: "Hindi (Natural/Hinglish)",
            mr: "Marathi (Natural)",
            te: "Telugu (Natural)",
            kn: "Kannada (Natural)",
            gu: "Gujarati (Natural)",
            ta: "Tamil (Natural)"
        };

        const systemPrompt = `You are "Authenex", a smart AI assistant for a Deepfake Detection Platform.
    
    TONE & STYLE:
    - You are helpful, smart, and "street-wise". 
    - Don't talk like a robot. Talk like a real person from India.
    - Use "Hinglish" or common slang if appropriate for ${languageMap[language]}.
    
    CORE KNOWLEDGE:
    - Authenex detects Deepfakes (Images/Video/Audio).
    - Users need "Credits" (10 per scan).
    - High "Risk Score" = Bad/Fake account activity.
    
    CRITICAL INSTRUCTION:
    - The user's current App Language is: "${languageMap[language]}".
    - You MUST reply IN "${languageMap[language]}" ONLY.
    - DO NOT reply in English unless the selected language IS English.
    - Translate your entire response to "${languageMap[language]}" immediately, even if the user asks in English.
    `;

        try {
            // Call Backend Proxy
            const response = await fetch(`${BACKEND_URL}/chat`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    messages: [
                        { role: "system", content: systemPrompt },
                        ...history,
                        { role: "user", content: message }
                    ],
                    model: "gpt-4o-mini"
                })
            });

            const data = await response.json();
            return data.choices?.[0]?.message?.content || "Server busy, try again.";
        } catch (error) {
            console.error("Backend Proxy Error:", error);
            return "Network error. Please check your connection.";
        }
    }

    static async speak(text: string): Promise<HTMLAudioElement> {
        try {
            // Call Backend Proxy
            const response = await fetch(`${BACKEND_URL}/speech`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    input: text,
                    voice: "alloy"
                })
            });

            const blob = await response.blob();
            const url = URL.createObjectURL(blob);
            return new Audio(url);
        } catch (error) {
            console.error("Backend Proxy TTS Error:", error);
            throw error;
        }
    }
}
