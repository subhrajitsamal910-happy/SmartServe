'use client';

import { FormEvent, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Bot, User, Sparkles, RotateCcw, Calendar, CheckCircle, ExternalLink } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { api } from '../lib/api';
import { ServiceItem } from '../lib/types';

type Message = {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  services?: ServiceItem[];
  suggestions?: string[];
  time: string;
};

const INITIAL_SUGGESTIONS = [
  '💡 What is SmartServe?',
  '⭐ Show top services',
  '📅 How does booking work?',
  '🛡️ How does fraud detection work?',
  '🔑 What are the demo logins?',
  '💳 Payment & pricing info'
];

export function ChatWidget() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'bot',
      text: "👋 Hi there! I'm **SmartServe AI Assistant**.\n\nAsk me anything about this platform: services, bookings, fraud detection, pricing, demo logins, or technology!",
      suggestions: INITIAL_SUGGESTIONS,
      time: 'Just now'
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen, messages]);

  const handleSend = async (messageText: string) => {
    const text = messageText.trim();
    if (!text || loading) return;

    const userMsg: Message = {
      id: String(Date.now()),
      sender: 'user',
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const result = await api.chat(text);
      const botMsg: Message = {
        id: String(Date.now() + 1),
        sender: 'bot',
        text: result.response,
        services: result.services?.length ? result.services : undefined,
        suggestions: result.suggestions?.length ? result.suggestions : undefined,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch {
      const errorMsg: Message = {
        id: String(Date.now() + 1),
        sender: 'bot',
        text: "I'm having a brief issue connecting to the SmartServe API. Please make sure the backend is running on `http://localhost:8080`.",
        suggestions: ['Show top services', 'What are demo logins?'],
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    void handleSend(input);
  };

  const resetChat = () => {
    setMessages([
      {
        id: 'welcome-reset',
        sender: 'bot',
        text: "👋 Conversation cleared! What would you like to know about SmartServe AI?",
        suggestions: INITIAL_SUGGESTIONS,
        time: 'Just now'
      }
    ]);
  };

  // Helper to render markdown-like formatting (bold, code, line breaks)
  const formatText = (content: string) => {
    return content.split('\n').map((line, idx) => {
      if (!line.trim()) return <div key={idx} className='h-2' />;

      // Format bullet points
      const isBullet = line.trim().startsWith('•') || line.trim().startsWith('-');
      const formattedLine = line.replace(/^[•-]\s*/, '');

      // Parse bold **text** and `code`
      const parts = formattedLine.split(/(\*\*.*?\*\*|`.*?`)/g);

      const parsed = parts.map((part, pIdx) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={pIdx} className='font-semibold text-slate-900 dark:text-white'>{part.slice(2, -2)}</strong>;
        }
        if (part.startsWith('`') && part.endsWith('`')) {
          return (
            <code key={pIdx} className='rounded bg-black/10 px-1.5 py-0.5 text-xs font-mono font-medium text-brand-700 dark:bg-white/10 dark:text-brand-300'>
              {part.slice(1, -1)}
            </code>
          );
        }
        return part;
      });

      return isBullet ? (
        <div key={idx} className='flex items-start gap-2 py-0.5'>
          <span className='text-brand-500 font-bold'>•</span>
          <div>{parsed}</div>
        </div>
      ) : (
        <p key={idx} className='py-0.5 leading-relaxed'>{parsed}</p>
      );
    });
  };

  return (
    <div className='fixed bottom-6 right-6 z-50 flex flex-col items-end'>
      {/* Floating Toggle Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(true)}
            className='group flex items-center gap-2.5 rounded-full bg-gradient-to-r from-brand-600 to-indigo-600 px-5 py-3.5 font-semibold text-white shadow-xl transition-shadow hover:shadow-brand-500/25'
          >
            <div className='relative'>
              <Sparkles className='h-5 w-5 text-amber-300 transition-transform group-hover:rotate-12' />
              <span className='absolute -top-1 -right-1 flex h-2 w-2'>
                <span className='absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75'></span>
                <span className='relative inline-flex h-2 w-2 rounded-full bg-emerald-500'></span>
              </span>
            </div>
            <span className='text-sm tracking-wide'>Ask SmartServe AI</span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window Dialog */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className='flex h-[600px] w-[92vw] max-w-md flex-col overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-2xl backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900'
          >
            {/* Header */}
            <div className='flex items-center justify-between border-b border-slate-200/60 bg-gradient-to-r from-brand-600 to-indigo-700 px-5 py-4 text-white dark:border-slate-800'>
              <div className='flex items-center gap-3'>
                <div className='flex h-10 w-10 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-md shadow-inner'>
                  <Bot className='h-5 w-5 text-white' />
                </div>
                <div>
                  <div className='flex items-center gap-2'>
                    <h3 className='font-bold text-sm tracking-wide'>SmartServe AI Concierge</h3>
                    <span className='flex h-2 w-2 rounded-full bg-emerald-400'></span>
                  </div>
                  <p className='text-xs text-white/80'>Answers any question about this platform</p>
                </div>
              </div>

              <div className='flex items-center gap-1'>
                <button
                  title='Reset conversation'
                  onClick={resetChat}
                  className='rounded-full p-2 text-white/80 transition hover:bg-white/10 hover:text-white'
                >
                  <RotateCcw size={16} />
                </button>
                <button
                  title='Close chat'
                  onClick={() => setIsOpen(false)}
                  className='rounded-full p-2 text-white/80 transition hover:bg-white/10 hover:text-white'
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Messages Area */}
            <div className='flex-1 space-y-4 overflow-y-auto p-4 text-sm'>
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div className='flex items-end gap-2 max-w-[85%]'>
                    {msg.sender === 'bot' && (
                      <div className='mb-1 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-brand-100 text-brand-700 dark:bg-brand-900/50 dark:text-brand-300'>
                        <Bot size={15} />
                      </div>
                    )}

                    <div
                      className={`rounded-2xl px-4 py-3 shadow-sm ${
                        msg.sender === 'user'
                          ? 'bg-brand-600 text-white rounded-br-sm'
                          : 'bg-slate-100 text-slate-800 dark:bg-slate-800/80 dark:text-slate-100 rounded-bl-sm border border-slate-200/50 dark:border-slate-700/50'
                      }`}
                    >
                      {formatText(msg.text)}

                      {/* Attached Services Cards */}
                      {msg.services && msg.services.length > 0 && (
                        <div className='mt-3 space-y-2 border-t border-slate-200/60 pt-2.5 dark:border-slate-700'>
                          <p className='text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400'>
                            Available Services:
                          </p>
                          <div className='grid gap-2'>
                            {msg.services.map((svc) => (
                              <div
                                key={svc.id}
                                className='group rounded-xl border border-slate-200 bg-white/90 p-2.5 shadow-sm transition hover:border-brand-500 dark:border-slate-700 dark:bg-slate-900/90'
                              >
                                <div className='flex items-start justify-between gap-2'>
                                  <div>
                                    <div className='font-semibold text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400'>
                                      {svc.title}
                                    </div>
                                    <div className='text-xs text-[var(--muted)]'>
                                      {svc.providerName} • {svc.category.replace('_', ' ')}
                                    </div>
                                  </div>
                                  <div className='text-right'>
                                    <div className='font-bold text-brand-600 dark:text-brand-400'>
                                      ₹{svc.price}
                                    </div>
                                    <div className='text-xs text-amber-500 font-medium'>
                                      ★ {svc.averageRating.toFixed(1)}
                                    </div>
                                  </div>
                                </div>
                                <button
                                  onClick={() => {
                                    setIsOpen(false);
                                    router.push('/dashboard');
                                  }}
                                  className='mt-2 flex w-full items-center justify-center gap-1.5 rounded-lg bg-slate-900 py-1.5 text-xs font-semibold text-white transition hover:bg-brand-600 dark:bg-slate-800 dark:hover:bg-brand-600'
                                >
                                  <Calendar size={13} /> Book on Dashboard
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Bot Suggestion Chips */}
                  {msg.sender === 'bot' && msg.suggestions && msg.suggestions.length > 0 && (
                    <div className='mt-2.5 ml-9 flex flex-wrap gap-1.5'>
                      {msg.suggestions.map((sug, sIdx) => (
                        <button
                          key={sIdx}
                          disabled={loading}
                          onClick={() => void handleSend(sug)}
                          className='rounded-full border border-brand-200/80 bg-brand-50/60 px-3 py-1 text-xs font-medium text-brand-700 transition hover:bg-brand-100 hover:border-brand-300 dark:border-brand-900/50 dark:bg-brand-950/40 dark:text-brand-300 dark:hover:bg-brand-900/60'
                        >
                          {sug}
                        </button>
                      ))}
                    </div>
                  )}

                  <span className='mt-1 px-1 text-[10px] text-slate-400'>
                    {msg.time}
                  </span>
                </div>
              ))}

              {/* Typing indicator */}
              {loading && (
                <div className='flex items-center gap-2 text-slate-400'>
                  <div className='flex h-7 w-7 items-center justify-center rounded-full bg-brand-100 text-brand-700 dark:bg-brand-900/50 dark:text-brand-300'>
                    <Bot size={15} />
                  </div>
                  <div className='flex items-center gap-1 rounded-2xl border border-slate-200 bg-slate-100 px-4 py-2.5 dark:border-slate-700 dark:bg-slate-800'>
                    <span className='h-2 w-2 animate-bounce rounded-full bg-brand-600 [animation-delay:-0.3s]'></span>
                    <span className='h-2 w-2 animate-bounce rounded-full bg-brand-600 [animation-delay:-0.15s]'></span>
                    <span className='h-2 w-2 animate-bounce rounded-full bg-brand-600'></span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Bar */}
            <form
              onSubmit={onSubmit}
              className='flex items-center gap-2 border-t border-slate-200/80 bg-slate-50/70 p-3 dark:border-slate-800 dark:bg-slate-900/80'
            >
              <input
                ref={inputRef}
                type='text'
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder='Ask anything about SmartServe...'
                disabled={loading}
                className='flex-1 rounded-2xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 disabled:opacity-60 dark:border-slate-700 dark:bg-slate-800 dark:text-white'
              />
              <button
                type='submit'
                disabled={!input.trim() || loading}
                className='flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-600 text-white transition hover:bg-brand-700 disabled:opacity-40 disabled:hover:bg-brand-600'
              >
                <Send size={16} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

