
import React, { useState, useEffect, useRef } from 'react';
import { askCareerCoach } from '../services/geminiService';

interface CareerCoachProps {
  externalPrompt?: string;
  onPromptProcessed?: () => void;
}

export const CareerCoach: React.FC<CareerCoachProps> = ({ externalPrompt, onPromptProcessed }) => {
  const [messages, setMessages] = useState<{role: 'user' | 'model', text: string}[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  // Handle external prompts (from results page)
  useEffect(() => {
    if (externalPrompt) {
      handleSend(externalPrompt);
      if (onPromptProcessed) onPromptProcessed();
    }
  }, [externalPrompt]);

  const handleSend = async (textToSend?: string) => {
    const messageText = textToSend || input;
    if (!messageText.trim() || isLoading) return;
    
    const userMsg = { role: 'user' as const, text: messageText };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      const history = messages.map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
      }));
      const response = await askCareerCoach(messageText, history);
      setMessages([...newMessages, { role: 'model', text: response }]);
    } catch (err) {
      console.error(err);
      setMessages([...newMessages, { role: 'model', text: "Maaf, terjadi kesalahan saat menghubungi pelatih AI." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div id="ai-career-coach" className="bg-slate-900 rounded-3xl p-6 text-white shadow-2xl overflow-hidden border border-slate-800 transition-all duration-500">
      <div className="flex items-center mb-6">
        <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center mr-3 ring-4 ring-blue-500/20">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"/>
          </svg>
        </div>
        <div>
          <h3 className="font-bold text-lg">AI Pelatih Karier</h3>
          <p className="text-xs text-slate-400">Didukung Gemini 3 Pro (Mode Berpikir)</p>
        </div>
      </div>

      <div 
        ref={scrollRef}
        className="h-80 overflow-y-auto space-y-4 mb-6 pr-2 scrollbar-thin scrollbar-thumb-slate-700 scroll-smooth"
      >
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center px-4 space-y-4">
            <div className="w-12 h-12 bg-slate-800 rounded-2xl flex items-center justify-center text-slate-500">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            </div>
            <p className="text-slate-500 text-sm italic">
              Klik saran pertanyaan di samping atau ketik pertanyaan Anda untuk mendalami strategi karier Anda.
            </p>
          </div>
        )}
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
            <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
              m.role === 'user' ? 'bg-blue-600 shadow-lg shadow-blue-500/20' : 'bg-slate-800 text-slate-200 border border-slate-700'
            }`}>
              {m.text}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-slate-800 rounded-2xl px-4 py-3 text-sm flex items-center space-x-3 border border-slate-700">
              <span className="text-slate-400 italic">Sedang Berpikir...</span>
              <div className="flex space-x-1">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="relative group">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Tanyakan apa pun tentang karier Anda..."
          className="w-full bg-slate-800 border border-slate-700 rounded-2xl px-5 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:outline-none placeholder-slate-500 transition-all pr-12"
        />
        <button 
          onClick={() => handleSend()}
          disabled={isLoading || !input.trim()}
          className="absolute right-2 top-1.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-30 p-2 rounded-xl transition-all shadow-lg active:scale-95"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
          </svg>
        </button>
      </div>
    </div>
  );
};
