import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, Bot, User, Loader2, Languages } from 'lucide-react';
import api from '../services/api';

export default function ChatPage() {
  const [messages, setMessages] = useState([
    { role: 'ai', content: 'Namaste! I am your ElectraGuide Assistant. How can I help you with the Indian election process today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // API call to backend
      const response = await api.post('/ai/chat', {
        message: input,
        history: messages.map(m => ({
          role: m.role === 'ai' ? 'model' : 'user',
          parts: [{ text: m.content }]
        }))
      });

      setMessages(prev => [...prev, { role: 'ai', content: response.data.response }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'ai', content: "I'm sorry, I encountered an error. Please try again later." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] p-4 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-4 glass p-4 rounded-2xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-saffron rounded-full flex items-center justify-center text-white">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-bold text-navy-chakra dark:text-white">Gemini AI Assistant</h2>
            <p className="text-xs text-green-election">Online | Multilingual Support</p>
          </div>
        </div>
        <button className="flex items-center gap-2 text-sm text-slate-500 hover:text-saffron transition-colors">
          <Languages className="w-4 h-4" />
          <span>English</span>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto space-y-4 mb-4 p-4 scrollbar-hide">
        {messages.map((m, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: m.role === 'ai' ? -20 : 20 }}
            animate={{ opacity: 1, x: 0 }}
            className={`flex ${m.role === 'ai' ? 'justify-start' : 'justify-end'}`}
          >
            <div className={`max-w-[80%] p-4 rounded-2xl ${
              m.role === 'ai' 
                ? 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 shadow-sm border border-slate-100 dark:border-slate-700' 
                : 'bg-saffron text-white shadow-md'
            }`}>
              {m.content}
            </div>
          </motion.div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-saffron" />
              <span className="text-sm text-slate-500">Gemini is thinking...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="relative">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about registration, polling dates, or voter ID..."
          className="w-full glass p-5 pr-16 rounded-2xl focus:outline-none focus:ring-2 focus:ring-saffron/50 transition-all shadow-lg"
          aria-label="Ask a question"
        />
        <button
          type="submit"
          disabled={isLoading}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-3 bg-saffron text-white rounded-xl hover:bg-saffron-dark transition-all disabled:opacity-50"
        >
          <Send className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
}
