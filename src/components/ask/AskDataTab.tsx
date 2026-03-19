import React, { useState, useRef, useEffect } from 'react';
import { SendHorizonal, AlertTriangle, Loader2 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

const QUICK_QUESTIONS = [
  "What is the overall conversion rate?",
  "Which device has the worst performance?",
  "Why do users 50+ convert less?",
  "What is the biggest drop in the funnel?",
  "How does Android compare to iOS?",
  "What should Kueski prioritize first?",
  "What do Other regions struggle with?",
  "What would you recommend to improve conversion?",
];

const formatMarkdown = (text: string) => {
  const lines = text.split('\n');
  const elements: React.ReactNode[] = [];
  let listItems: string[] = [];

  const flushList = () => {
    if (listItems.length > 0) {
      elements.push(
        <ul key={`ul-${elements.length}`} className="list-disc pl-4 space-y-1 my-1">
          {listItems.map((item, i) => (
            <li key={i}>{boldify(item)}</li>
          ))}
        </ul>
      );
      listItems = [];
    }
  };

  const boldify = (str: string): React.ReactNode => {
    const parts = str.split(/\*\*(.*?)\*\*/g);
    return parts.map((part, i) =>
      i % 2 === 1 ? <strong key={i}>{part}</strong> : part
    );
  };

  lines.forEach((line, i) => {
    const trimmed = line.trim();
    if (trimmed.startsWith('- ') || trimmed.startsWith('• ')) {
      listItems.push(trimmed.slice(2));
    } else {
      flushList();
      if (trimmed === '') {
        elements.push(<br key={`br-${i}`} />);
      } else {
        elements.push(<p key={`p-${i}`} className="my-0.5">{boldify(trimmed)}</p>);
      }
    }
  });
  flushList();

  return elements;
};

const TypingIndicator = () => (
  <div className="flex items-start max-w-[85%] mr-auto">
    <div className="bg-[#F5F6FB] text-[#141C22] rounded-2xl rounded-tl-sm px-4 py-3 flex gap-1.5 items-center">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="w-2 h-2 bg-[#66727D] rounded-full animate-bounce"
          style={{ animationDelay: `${i * 150}ms` }}
        />
      ))}
    </div>
  </div>
);

const AskDataTab = () => {
  const { t } = useLanguage();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const sendMessage = async (text?: string) => {
    const content = (text ?? input).trim();
    if (!content || loading) return;

    const userMessage: ChatMessage = { role: 'user', content };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch(
        'https://moukqztzsjvtzgethhlo.supabase.co/functions/v1/ask-the-data',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ messages: newMessages }),
        }
      );
      const data = await response.json();
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: data.response ?? t('ask_error_generic'),
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: t('ask_error_connection') },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + 'px';
    }
  }, [input]);

  return (
    <div className="bg-card rounded-2xl shadow-sm flex flex-col" style={{ minHeight: '70vh' }}>
      {/* Header */}
      <div className="p-6 pb-0">
        <h1 className="text-xl font-[800] text-[#00164C]">{t('ask_title')}</h1>
        <p className="text-sm text-[#384550] mt-1">{t('ask_subtitle')}</p>
        <div className="mt-2 inline-flex items-center gap-1.5 bg-[#F5F6FB] border border-gray-200 rounded-full px-3 py-1">
          <AlertTriangle size={12} className="text-[#66727D]" />
          <span className="text-xs text-[#66727D]">{t('ask_disclaimer')}</span>
        </div>
      </div>

      {/* Quick Questions */}
      <div className="px-6 pt-4 pb-2">
        <p className="text-xs font-semibold text-[#66727D] uppercase tracking-wide mb-2">
          {t('ask_quick')}
        </p>
        <div className="flex flex-wrap gap-2">
          {QUICK_QUESTIONS.map((q) => (
            <button
              key={q}
              onClick={() => sendMessage(q)}
              disabled={loading}
              className="bg-[#F5F6FB] hover:bg-[#EFF6FF] border border-gray-200 rounded-full px-3 py-1.5 text-xs text-[#384550] hover:text-[#0075FF] hover:border-[#0075FF] transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Chat area */}
      <div className="flex-1 flex flex-col px-6 pb-6">
        <div className="flex-1 overflow-y-auto space-y-4 py-4 min-h-[300px] max-h-[400px]">
          {messages.length === 0 && !loading ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <span className="text-4xl mb-3">💬</span>
              <p className="text-sm text-[#66727D]">{t('ask_empty')}</p>
            </div>
          ) : (
            <>
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={
                      msg.role === 'user'
                        ? 'bg-[#0075FF] text-white rounded-2xl rounded-tr-sm px-4 py-3 text-sm max-w-[80%] ml-auto'
                        : 'bg-[#F5F6FB] text-[#141C22] rounded-2xl rounded-tl-sm px-4 py-3 text-sm max-w-[85%] mr-auto'
                    }
                  >
                    {msg.role === 'assistant' ? formatMarkdown(msg.content) : msg.content}
                  </div>
                </div>
              ))}
              {loading && <TypingIndicator />}
            </>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input row */}
        <div className="flex gap-2 mt-3 items-end">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={t('ask_placeholder')}
            rows={2}
            className="flex-1 bg-[#F5F6FB] border border-gray-200 rounded-xl px-4 py-3 text-sm text-[#141C22] placeholder:text-[#66727D] focus:border-[#0075FF] focus:ring-1 focus:ring-[#0075FF] outline-none resize-none"
          />
          <button
            onClick={() => sendMessage()}
            disabled={!input.trim() || loading}
            className="bg-[#0075FF] hover:bg-[#005ECC] text-white rounded-xl px-4 py-3 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <SendHorizonal size={18} />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AskDataTab;
