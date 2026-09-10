import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, User, Sparkles, AlertCircle, MessageSquare } from 'lucide-react';
import { CoachMessage, StudentSkill, EvaluatedSkill } from '../../shared/types.ts';

interface CareerCoachChatProps {
  career: string;
  readinessScore: number;
  studentSkills: StudentSkill[];
  evaluatedSkills: EvaluatedSkill[];
}

const PRESET_QUESTIONS = [
  'What should I learn first?',
  'How can I become job-ready?',
  'Which skill gap is most important?',
  'What project should I build?',
  'Am I ready for a Java backend role?',
];

export const CareerCoachChat: React.FC<CareerCoachChatProps> = ({
  career,
  readinessScore,
  studentSkills,
  evaluatedSkills,
}) => {
  const [messages, setMessages] = useState<CoachMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: `Hello! I am your AI Career Coach. Based on your skill evaluation for **${career}** (${readinessScore}% readiness score), I am ready to advise you on study priorities, portfolio projects, and interview preparation. What would you like to explore?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      aiEnhanced: true,
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isSending]);

  const handleSend = async (textToSend?: string) => {
    const query = (textToSend || inputText).trim();
    if (!query || isSending) return;

    const userMsg: CoachMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsSending(true);

    try {
      const response = await fetch('/api/career-coach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          history: messages.slice(-4),
          context: {
            career,
            readinessScore,
            studentSkills,
            evaluatedSkills,
          },
        }),
      });

      if (!response.ok) throw new Error('Coach service error');
      const data = await response.json();

      const coachMsg: CoachMessage = {
        id: `coach-${Date.now()}`,
        role: 'assistant',
        content: data.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        aiEnhanced: data.aiEnhanced,
      };

      setMessages((prev) => [...prev, coachMsg]);
    } catch (err) {
      console.error(err);
      const fallbackMsg: CoachMessage = {
        id: `coach-fallback-${Date.now()}`,
        role: 'assistant',
        content: `Based on your profile for ${career}, prioritize your highest-ranked skill gaps in the roadmap and validate them with small repository implementations.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        aiEnhanced: false,
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div id="coach-section" className="bg-slate-900/70 backdrop-blur-md border border-slate-800 rounded-2xl p-6 shadow-xl mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-4 border-b border-slate-800/80">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-md shadow-cyan-500/20">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold text-white">Ask CareerGap AI</h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-950 text-cyan-300 border border-cyan-800/60">
                Gemini 3.8 Flash
              </span>
            </div>
            <p className="text-xs text-slate-400">Contextual technical career coaching powered by your exact gap analytics</p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>Context: {career} ({readinessScore}%)</span>
        </div>
      </div>

      {/* Preset Question Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-3 mb-3 text-xs">
        <span className="text-[11px] text-slate-500 flex items-center gap-1 whitespace-nowrap font-mono">
          <Sparkles className="w-3 h-3 text-cyan-400" /> Suggestion:
        </span>
        {PRESET_QUESTIONS.map((q, idx) => (
          <button
            key={idx}
            id={`preset-question-btn-${idx}`}
            type="button"
            onClick={() => handleSend(q)}
            disabled={isSending}
            className="px-3 py-1 rounded-lg bg-slate-950 hover:bg-cyan-950/60 border border-slate-800 hover:border-cyan-700/60 text-slate-300 hover:text-cyan-200 whitespace-nowrap transition-all text-xs cursor-pointer disabled:opacity-50"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Chat Messages Log */}
      <div className="bg-slate-950/70 border border-slate-800/80 rounded-2xl p-4 h-80 overflow-y-auto space-y-4 mb-4 shadow-inner">
        {messages.map((m) => {
          const isUser = m.role === 'user';

          return (
            <div
              key={m.id}
              className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
            >
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-xs ${
                  isUser
                    ? 'bg-blue-600 text-white'
                    : 'bg-gradient-to-tr from-cyan-600 to-blue-600 text-white'
                }`}
              >
                {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div
                className={`max-w-[85%] sm:max-w-[75%] p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                  isUser
                    ? 'bg-blue-600 text-white rounded-tr-none'
                    : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-none'
                }`}
              >
                <div className="whitespace-pre-wrap">{m.content}</div>
                <div className="mt-1.5 flex items-center justify-between text-[10px] text-slate-400">
                  <span>{m.timestamp}</span>
                  {!isUser && m.aiEnhanced && (
                    <span className="text-cyan-400 font-mono">Gemini AI</span>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {isSending && (
          <div className="flex gap-3">
            <div className="w-7 h-7 rounded-lg bg-cyan-700 flex items-center justify-center shrink-0 text-white">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-slate-900 border border-slate-800 p-3 rounded-2xl rounded-tl-none flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce" />
              <div className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce delay-100" />
              <div className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce delay-200" />
              <span className="text-xs text-slate-400 ml-1">Analyzing context...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Box */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="flex items-center gap-2"
      >
        <input
          id="coach-chat-input"
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={`Ask about ${career} interview questions, projects, or study tips...`}
          className="flex-1 px-4 py-3 bg-slate-950 border border-slate-700 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
        />

        <button
          id="coach-send-button"
          type="submit"
          disabled={!inputText.trim() || isSending}
          className="p-3 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-md shadow-cyan-900"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
