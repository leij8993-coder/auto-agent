'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { getSessions, createSession, deleteSession } from '@/lib/session';
import { formatDate, truncate } from '@/lib/utils';
import type { AgentId, ChatSession } from '@/types';

interface NavItem {
  label: string;
  href: string;
  icon: string;
  agentId?: AgentId;
  gradient: string;
}

const navItems: NavItem[] = [
  { label: '控制台', href: '/', icon: '◆', gradient: 'from-indigo-500 to-violet-500' },
  { label: '车辆评估', href: '/agents/valuation', icon: '◈', agentId: 'valuation', gradient: 'from-blue-500 to-cyan-400' },
  { label: '客户服务', href: '/agents/customer', icon: '◉', agentId: 'customer', gradient: 'from-emerald-500 to-teal-400' },
  { label: '市场分析', href: '/agents/market', icon: '◇', agentId: 'market', gradient: 'from-purple-500 to-pink-400' },
  { label: '车辆检测', href: '/agents/inspection', icon: '◎', agentId: 'inspection', gradient: 'from-orange-500 to-amber-400' },
  { label: '交易顾问', href: '/agents/advisor', icon: '◍', agentId: 'advisor', gradient: 'from-rose-500 to-pink-400' },
];

interface SidebarProps {
  onSessionSelect?: (sessionId: string) => void;
  currentSessionId?: string;
}

export default function Sidebar({ onSessionSelect, currentSessionId }: SidebarProps) {
  const pathname = usePathname();
  const [expandedAgent, setExpandedAgent] = useState<AgentId | null>(null);
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const refreshSessions = useCallback(() => {
    setSessions(getSessions());
  }, []);

  useEffect(() => {
    refreshSessions();
  }, [refreshSessions, pathname]);

  // Auto-expand the current agent's sessions
  useEffect(() => {
    const current = navItems.find((item) => item.href === pathname);
    if (current?.agentId) {
      setExpandedAgent(current.agentId);
    }
  }, [pathname]);

  function handleNewSession(agentId: AgentId) {
    const session = createSession(agentId);
    refreshSessions();
    onSessionSelect?.(session.id);
  }

  function handleDeleteSession(e: React.MouseEvent, sessionId: string) {
    e.stopPropagation();
    e.preventDefault();
    deleteSession(sessionId);
    refreshSessions();
  }

  function getAgentSessions(agentId: AgentId) {
    return sessions
      .filter((s) => s.agentId === agentId)
      .sort((a, b) => b.updatedAt - a.updatedAt);
  }

  const currentAgent = navItems.find((item) => item.href === pathname);

  return (
    <aside className="w-72 min-h-screen flex flex-col relative z-10" style={{ background: 'rgba(10, 10, 18, 0.95)', borderRight: '1px solid rgba(255,255,255,0.06)' }}>
      {/* Logo */}
      <div className="px-5 py-5" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-sm font-bold" style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
            A
          </div>
          <div>
            <h1 className="text-sm font-semibold text-white tracking-tight">Auto Agent</h1>
            <p className="text-[10px] text-zinc-500 tracking-wide uppercase">二手车智能平台</p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-3 px-3">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const isExpanded = expandedAgent === item.agentId;
          const agentSessions = item.agentId ? getAgentSessions(item.agentId) : [];

          return (
            <div key={item.href} className="mb-0.5">
              <div
                className="relative"
                onMouseEnter={() => setHoveredItem(item.href)}
                onMouseLeave={() => setHoveredItem(null)}
              >
                {/* Active indicator */}
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full" style={{ background: 'linear-gradient(180deg, #6366f1, #8b5cf6)' }} />
                )}

                <Link
                  href={item.href}
                  className={cn(
                    'flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] transition-all duration-200',
                    isActive
                      ? 'text-white'
                      : 'text-zinc-400 hover:text-zinc-200'
                  )}
                  style={isActive ? { background: 'rgba(99, 102, 241, 0.1)' } : undefined}
                  onClick={() => {
                    if (item.agentId) {
                      setExpandedAgent(isExpanded ? null : item.agentId);
                    }
                  }}
                >
                  <span className={cn(
                    'w-5 h-5 rounded-md flex items-center justify-center text-[10px] shrink-0 transition-colors',
                    isActive ? 'text-white' : 'text-zinc-500'
                  )} style={isActive ? { background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' } : { background: 'rgba(255,255,255,0.04)' }}>
                    {item.icon}
                  </span>
                  <span className="flex-1">{item.label}</span>
                  {item.agentId && (
                    <span className="text-[10px] text-zinc-600">
                      {isExpanded ? '▾' : '▸'}
                    </span>
                  )}
                </Link>

                {/* New session button on hover */}
                {item.agentId && hoveredItem === item.href && !isActive && (
                  <button
                    onClick={(e) => { e.preventDefault(); handleNewSession(item.agentId!); }}
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-5 h-5 rounded-md flex items-center justify-center text-zinc-500 hover:text-white hover:bg-zinc-700 transition-colors text-xs"
                    title="新对话"
                  >
                    +
                  </button>
                )}
              </div>

              {/* Session list */}
              {item.agentId && isExpanded && (
                <div className="ml-4 mt-0.5 mb-1 space-y-0.5 animate-fade-in">
                  <button
                    onClick={() => handleNewSession(item.agentId!)}
                    className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-[11px] text-zinc-500 hover:text-zinc-300 transition-colors"
                    style={{ background: 'rgba(255,255,255,0.02)' }}
                  >
                    <span className="text-indigo-400">+</span>
                    <span>新对话</span>
                  </button>
                  {agentSessions.map((session) => (
                    <div
                      key={session.id}
                      className={cn(
                        'group flex items-center gap-2 px-3 py-1.5 rounded-lg text-[11px] cursor-pointer transition-all',
                        currentSessionId === session.id
                          ? 'text-zinc-200'
                          : 'text-zinc-500 hover:text-zinc-300'
                      )}
                      style={currentSessionId === session.id ? { background: 'rgba(99, 102, 241, 0.08)' } : undefined}
                      onClick={() => onSessionSelect?.(session.id)}
                    >
                      <span className="truncate flex-1">{truncate(session.title, 18)}</span>
                      <span className="text-[9px] text-zinc-600 shrink-0">{formatDate(session.updatedAt)}</span>
                      <button
                        onClick={(e) => handleDeleteSession(e, session.id)}
                        className="opacity-0 group-hover:opacity-100 w-4 h-4 rounded flex items-center justify-center text-zinc-600 hover:text-red-400 hover:bg-red-400/10 transition-all text-[10px] shrink-0"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  {agentSessions.length === 0 && (
                    <p className="text-[10px] text-zinc-600 px-3 py-1">暂无对话记录</p>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="px-4 py-4" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <Link
          href="/admin"
          className={cn(
            'flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] transition-colors',
            pathname === '/admin' ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'
          )}
          style={pathname === '/admin' ? { background: 'rgba(255,255,255,0.04)' } : undefined}
        >
          <span className="w-5 h-5 rounded-md flex items-center justify-center text-[10px]" style={{ background: 'rgba(255,255,255,0.04)' }}>⚙</span>
          <span>设置</span>
        </Link>
        <div className="flex items-center gap-2 mt-3 px-3">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[10px] text-zinc-600">5 Agents 在线</span>
        </div>
      </div>
    </aside>
  );
}
