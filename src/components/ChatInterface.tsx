'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { cn, generateId, formatTime, truncate } from '@/lib/utils';
import { getSystemConfig } from '@/lib/config';
import { createSession, addMessageToSession, getSession, updateSession } from '@/lib/session';
import type { ChatMessage, AgentId } from '@/types';

interface ChatInterfaceProps {
  agentId: AgentId;
  agentName: string;
  agentIcon: string;
  agentGradient: string;
  placeholder?: string;
  sessionId?: string;
  onSessionCreated?: (sessionId: string) => void;
}

export default function ChatInterface({
  agentId,
  agentName,
  agentIcon,
  agentGradient,
  placeholder,
  sessionId: externalSessionId,
  onSessionCreated,
}: ChatInterfaceProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(externalSessionId || null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Load session messages when sessionId changes
  useEffect(() => {
    if (externalSessionId) {
      const session = getSession(externalSessionId);
      if (session) {
        setMessages(session.messages);
        setCurrentSessionId(externalSessionId);
      }
    }
  }, [externalSessionId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + 'px';
    }
  }, [input]);

  function ensureSession(): string {
    if (currentSessionId) return currentSessionId;
    const session = createSession(agentId);
    setCurrentSessionId(session.id);
    onSessionCreated?.(session.id);
    return session.id;
  }

  async function handleSend() {
    const text = input.trim();
    if (!text || loading) return;

    const sid = ensureSession();

    const userMsg: ChatMessage = {
      id: generateId(),
      role: 'user',
      content: text,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMsg]);
    addMessageToSession(sid, userMsg);
    setInput('');
    setLoading(true);

    try {
      const config = getSystemConfig();
      const res = await fetch(`/api/agent/${agentId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, history: messages, config }),
      });

      if (!res.ok) throw new Error('API请求失败');

      const data = await res.json();
      const assistantMsg: ChatMessage = {
        id: generateId(),
        role: 'assistant',
        content: data.reply || '暂无回复',
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, assistantMsg]);
      addMessageToSession(sid, assistantMsg);

      // Update session title if first exchange
      const session = getSession(sid);
      if (session && session.title === '新对话') {
        updateSession(sid, { title: truncate(text, 20) });
      }
    } catch {
      const errorMsg: ChatMessage = {
        id: generateId(),
        role: 'assistant',
        content: '抱歉，请求出错了，请检查API配置后重试。',
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, errorMsg]);
      addMessageToSession(sid, errorMsg);
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  function startNewChat() {
    setMessages([]);
    setCurrentSessionId(null);
    setInput('');
  }

  // Parse markdown-like formatting for assistant messages
  function renderContent(content: string, isUser: boolean) {
    if (isUser) return content;
    // Simple formatting: bold, line breaks, bullet points
    return content
      .replace(/\*\*(.*?)\*\*/g, '⟨b⟩$1⟨/b⟩')
      .replace(/\n- /g, '\n• ')
      .replace(/\n(\d+)\. /g, '\n$1. ')
      .split('⟨b⟩')
      .map((part, i) => {
        const [bold, rest] = part.split('⟨/b⟩');
        if (rest !== undefined) {
          return <span key={i}><strong className="text-white font-medium">{bold}</strong>{rest}</span>;
        }
        return <span key={i}>{bold}</span>;
      });
  }

  return (
    <div className="flex flex-col h-full relative">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-3.5" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(10, 10, 18, 0.6)', backdropFilter: 'blur(20px)' }}>
        <div className="flex items-center gap-3">
          <div className={cn('w-9 h-9 rounded-xl flex items-center justify-center text-white text-sm font-bold')} style={{ background: agentGradient }}>
            {agentIcon}
          </div>
          <div>
            <h2 className="text-white font-medium text-sm">{agentName}</h2>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" style={{ animation: 'pulse-soft 2s ease-in-out infinite' }} />
              <span className="text-[10px] text-zinc-500">在线</span>
            </div>
          </div>
        </div>
        <button
          onClick={startNewChat}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] text-zinc-500 hover:text-zinc-300 transition-colors"
          style={{ background: 'rgba(255,255,255,0.04)' }}
          title="新对话"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14"/></svg>
          新对话
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-5">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center animate-fade-in">
            <div className={cn('w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mb-5')} style={{ background: agentGradient }}>
              {agentIcon}
            </div>
            <p className="text-zinc-400 text-base font-medium mb-2">{agentName}</p>
            <p className="text-zinc-600 text-sm max-w-xs">{placeholder || `向${agentName}提问，开始智能对话`}</p>
            <div className="flex gap-2 mt-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="w-1.5 h-1.5 rounded-full bg-zinc-700" style={{ animation: `pulse-soft 1.5s ease-in-out ${i * 0.2}s infinite` }} />
              ))}
            </div>
          </div>
        )}
        {messages.map((msg, idx) => (
          <div
            key={msg.id}
            className={cn(
              'flex gap-3 message-appear',
              msg.role === 'user' ? 'justify-end' : 'justify-start'
            )}
            style={{ animationDelay: `${Math.min(idx * 30, 300)}ms` }}
          >
            {msg.role === 'assistant' && (
              <div className="w-8 h-8 rounded-xl flex items-center justify-center text-xs shrink-0 mt-0.5" style={{ background: agentGradient }}>
                {agentIcon}
              </div>
            )}
            <div className="max-w-[70%]">
              <div
                className={cn(
                  'rounded-2xl px-4 py-3 text-[13px] leading-relaxed',
                  msg.role === 'user'
                    ? 'text-white'
                    : 'text-zinc-300'
                )}
                style={msg.role === 'user'
                  ? { background: agentGradient }
                  : { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }
                }
              >
                <div className="whitespace-pre-wrap break-words">{renderContent(msg.content, msg.role === 'user')}</div>
              </div>
              <p className={cn(
                'text-[10px] mt-1.5 px-1',
                msg.role === 'user' ? 'text-zinc-600 text-right' : 'text-zinc-700'
              )}>
                {formatTime(msg.timestamp)}
              </p>
            </div>
            {msg.role === 'user' && (
              <div className="w-8 h-8 rounded-xl flex items-center justify-center text-xs shrink-0 mt-0.5" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}>
                U
              </div>
            )}
          </div>
        ))}
        {loading && (
          <div className="flex gap-3 animate-fade-in">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center text-xs shrink-0" style={{ background: agentGradient }}>
              {agentIcon}
            </div>
            <div className="rounded-2xl px-4 py-3" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div className="flex gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 typing-dot" />
                <span className="w-1.5 h-1.5 rounded-full bg-violet-400 typing-dot" />
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400 typing-dot" />
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="px-4 pb-4 pt-2">
        <div
          className="flex items-end gap-3 rounded-2xl px-4 py-3 transition-all"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
        >
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder || `向${agentName}提问...`}
            rows={1}
            className="flex-1 bg-transparent text-white text-[13px] resize-none focus:outline-none placeholder:text-zinc-600 leading-relaxed min-h-[20px] max-h-[120px]"
          />
          <button
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className={cn(
              'w-8 h-8 rounded-xl flex items-center justify-center transition-all shrink-0',
              input.trim() && !loading
                ? 'text-white hover:opacity-90'
                : 'text-zinc-600'
            )}
            style={input.trim() && !loading ? { background: agentGradient } : { background: 'rgba(255,255,255,0.04)' }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/></svg>
          </button>
        </div>
        <p className="text-[10px] text-zinc-700 text-center mt-2">Enter 发送 · Shift+Enter 换行</p>
      </div>
    </div>
  );
}
