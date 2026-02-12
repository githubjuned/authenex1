import React, { useState, useRef, useEffect } from 'react';
import { OpenAIService } from '../services/openai';
import { Language, User } from '../types';

interface ChatBotProps {
    language: Language;
    user: User;
}

interface Message {
    id: string;
    role: 'user' | 'model';
    text: string;
    timestamp: Date;
}

export const ChatBot: React.FC<ChatBotProps> = ({ language, user }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [input, setInput] = useState('');
    const greetings: Record<Language, string> = {
        en: `Greetings ${user.name}. I am the Authenex Intelligence Unit. How may I assist your forensic operations today?`,
        hi: `नमस्ते ${user.name}. मैं ऑथेनेक्स इंटेलिजेंस यूनिट हूँ. आज मैं आपकी फॉरेंसिक जाँच में कैसे मदद कर सकता हूँ?`,
        mr: `नमस्कार ${user.name}. मी ऑथेनेक्स इंटेलिजन्स युनिट आहे. आज मी तुमच्या फॉरेन्सिक ऑपरेशन्समध्ये कशी मदत करू शकतो?`,
        te: `నమస్కారం ${user.name}. నేను ఆథెనెక్స్ ఇంటిలిజెన్స్ యూనిట్. ఈ రోజు మీ ఫోరెన్సిక్ కార్యకలాపాలలో నేను మీకు ఎలా సహాయపడగలను?`,
        kn: `ನಮಸ್ಕಾರ ${user.name}. ನಾನು ಆಥೆನೆಕ್ಸ್ ಇಂಟೆಲಿಜೆನ್ಸ್ ಘಟಕ. ಇಂದು ನಿಮ್ಮ ಫೊರೆನ್ಸಿಕ್ ಕಾರ್ಯಾಚರಣೆಗಳಲ್ಲಿ ನಾನು ನಿಮಗೆ ಹೇಗೆ ಸಹಾಯ ಮಾಡಬಹುದು?`,
        gu: `નમસ્તે ${user.name}. હું ઓથેનેક્સ ઈન્ટેલિજન્સ યુનિટ છું. આજે હું તમારી ફોરેન્સિક કામગીરીમાં કેવી રીતે મદદ કરી શકું?`,
        ta: `வணக்கம் ${user.name}. நான் ஆதினெக்ஸ் நுண்ணறிவுப் பிரிவு. இன்று உங்கள் தடயவியல் நடவடிக்கைகளில் நான் எவ்வாறு உதவ முடியும்?`
    };

    const [messages, setMessages] = useState<Message[]>([
        {
            id: 'welcome',
            role: 'assistant', // Valid OpenAI Role
            text: greetings[language] || greetings['en'],
            timestamp: new Date()
        }
    ]);

    // Update welcome message when language changes (if conversation is empty/fresh)
    useEffect(() => {
        setMessages(prev => {
            if (prev.length === 1 && prev[0].id === 'welcome') {
                return [{
                    ...prev[0],
                    text: greetings[language] || greetings['en']
                }];
            }
            return prev;
        });
    }, [language]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isOpen]);

    // Speech Recognition Setup
    const handleListen = () => {
        if (!('webkitSpeechRecognition' in window)) {
            alert("Speech recognition is not supported in this browser. Please use Chrome.");
            return;
        }

        const recognition = new (window as any).webkitSpeechRecognition();

        // Map App Language to Speech Recognition Lang Code
        const langMap: Record<Language, string> = {
            en: 'en-US',
            hi: 'hi-IN',
            mr: 'mr-IN',
            te: 'te-IN',
            kn: 'kn-IN',
            gu: 'gu-IN',
            ta: 'ta-IN'
        };
        recognition.lang = langMap[language];
        recognition.continuous = false;
        recognition.interimResults = false;

        recognition.onstart = () => setIsListening(true);
        recognition.onend = () => setIsListening(false);

        recognition.onresult = (event: any) => {
            const transcript = event.results[0][0].transcript;
            setInput(transcript);
            handleSend(transcript, true); // Auto-send on voice end with voice flag
        };

        recognition.start();
    };

    // Text to Speech
    const speak = async (text: string) => {
        try {
            const audio = await OpenAIService.speak(text);
            audio.play();
        } catch (error) {
            console.error("TTS Error:", error);
        }
    };

    const handleSend = async (text: string = input, isVoice: boolean = false) => {
        if (!text.trim()) return;

        const newUserMsg: Message = {
            id: Date.now().toString(),
            role: 'user',
            text: text,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, newUserMsg]);
        setInput('');
        setIsProcessing(true);

        try {
            // Prepare history for OpenAI (excluding welcome message)
            // OpenAI requires roles to be 'user' or 'assistant' (not 'model')
            const history = messages
                .filter(m => m.id !== 'welcome')
                .map(m => ({
                    role: (m.role === 'model' ? 'assistant' : m.role) as 'user' | 'assistant',
                    content: m.text
                }));

            const responseText = await OpenAIService.chat(text, history, language);

            const newBotMsg: Message = {
                id: (Date.now() + 1).toString(),
                role: 'model',
                text: responseText,
                timestamp: new Date()
            };

            setMessages(prev => [...prev, newBotMsg]);

            // ONLY speak if the input was via Voice
            if (isVoice) {
                await speak(responseText);
            }

        } catch (error) {
            console.error("Chat Error:", error);
            setMessages(prev => [...prev, {
                id: Date.now().toString(),
                role: 'model',
                text: "Neural Link Severed. Unable to process request.",
                timestamp: new Date()
            }]);
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="fixed bottom-28 md:bottom-6 right-6 z-[120] flex flex-col items-end">
            {/* Search/Chat Window */}
            {isOpen && (
                <div className="mb-4 w-[90vw] md:w-[400px] h-[500px] bg-[#0b1424]/95 backdrop-blur-xl border border-cyan-500/30 rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-10 fade-in duration-300">

                    {/* Header */}
                    <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
                        <div className="flex items-center gap-3">
                            <div className="relative w-8 h-8 flex items-center justify-center bg-white/10 rounded-full border border-cyan-500/30">
                                <svg role="img" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-cyan-400">
                                    <path d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 2.3408 7.872zm16.5963 3.8558L13.1038 8.364 15.1192 7.2a.0757.0757 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1-.6765 8.1042v-5.6772a.79.79 0 0 0-.407-.667zm2.0107-3.0231l-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L9.409 9.2297V6.8974a.0662.0662 0 0 1 .0284-.0615l4.8303-2.7865a4.4944 4.4944 0 0 1 6.6802 4.66zM8.3065 12.863l-2.02-1.1638a.0804.0804 0 0 1-.038-.0567V6.0742a4.4992 4.4992 0 0 1 7.3757-3.453l-.142.0805L8.704 5.459a.7948.7948 0 0 0-.3927.6813zm1.0976-2.3654l2.602-1.4998 2.6069 1.4998v2.9994l-2.5974 1.4997-2.6067-1.4997Z" />
                                </svg>
                            </div>
                            <span className="text-xs font-black text-white uppercase tracking-widest">
                                Authenex AI
                            </span>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="text-slate-500 hover:text-white transition-colors">
                            <i className="fas fa-times"></i>
                        </button>
                    </div>

                    {/* Messages Area */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth">
                        {messages.map((msg) => (
                            <div
                                key={msg.id}
                                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-[85%] p-3 rounded-2xl text-xs md:text-sm font-medium leading-relaxed ${msg.role === 'user'
                                        ? 'bg-cyan-600 text-white rounded-br-none'
                                        : 'bg-slate-800 text-slate-300 rounded-bl-none border border-slate-700'
                                        }`}
                                >
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                        {isProcessing && (
                            <div className="flex justify-start">
                                <div className="bg-slate-800/50 p-3 rounded-2xl rounded-bl-none border border-slate-700/50 flex gap-1">
                                    <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-bounce"></div>
                                    <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-bounce [animation-delay:0.1s]"></div>
                                    <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className="p-4 bg-slate-900/80 border-t border-slate-800 flex items-center gap-2">
                        <button
                            onClick={handleListen}
                            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${isListening
                                ? 'bg-red-500 text-white animate-pulse'
                                : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
                                }`}
                        >
                            <i className={`fas ${isListening ? 'fa-microphone-lines' : 'fa-microphone'}`}></i>
                        </button>

                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                            placeholder={isListening ? "Listening..." : "Ask Authenex..."}
                            className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500 transition-colors placeholder:text-slate-600"
                            disabled={isProcessing || isListening}
                        />

                        <button
                            onClick={() => handleSend()}
                            disabled={!input.trim() || isProcessing}
                            className="w-10 h-10 rounded-full bg-cyan-600 text-white flex items-center justify-center hover:bg-cyan-500 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                            <i className="fas fa-paper-plane text-xs"></i>
                        </button>
                    </div>
                </div>
            )}

            {/* Floating Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`relative w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center transition-all duration-500 shadow-[0_0_30px_rgba(8,145,178,0.3)] hover:shadow-[0_0_50px_rgba(8,145,178,0.5)] active:scale-90 z-[120] ${isOpen ? 'bg-slate-800 rotate-90 scale-90' : 'bg-gradient-to-br from-cyan-500 to-blue-600'
                    }`}
            >
                {isOpen ? (
                    <i className="fas fa-chevron-down text-white text-xl"></i>
                ) : (
                    <>
                        {/* <i className="fas fa-robot text-white text-2xl animate-[wiggle_3s_ease-in-out_infinite]"></i> */}
                        <svg role="img" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-white animate-[spin_10s_linear_infinite]">
                            <path d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 2.3408 7.872zm16.5963 3.8558L13.1038 8.364 15.1192 7.2a.0757.0757 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1-.6765 8.1042v-5.6772a.79.79 0 0 0-.407-.667zm2.0107-3.0231l-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L9.409 9.2297V6.8974a.0662.0662 0 0 1 .0284-.0615l4.8303-2.7865a4.4944 4.4944 0 0 1 6.6802 4.66zM8.3065 12.863l-2.02-1.1638a.0804.0804 0 0 1-.038-.0567V6.0742a4.4992 4.4992 0 0 1 7.3757-3.453l-.142.0805L8.704 5.459a.7948.7948 0 0 0-.3927.6813zm1.0976-2.3654l2.602-1.4998 2.6069 1.4998v2.9994l-2.5974 1.4997-2.6067-1.4997Z" />
                        </svg>
                        <span className="absolute -top-1 -right-1 flex h-4 w-4">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-4 w-4 bg-green-500 border-2 border-[#0b1424]"></span>
                        </span>
                    </>
                )}
            </button>
        </div>
    );
};
