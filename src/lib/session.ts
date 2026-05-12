import type { ChatSession, ChatMessage, AgentId } from '@/types';
import { generateId, truncate } from '@/lib/utils';

const STORAGE_KEY = 'auto_agent_sessions';

function loadAll(): ChatSession[] {
  if (typeof window === 'undefined') return [];
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function saveAll(sessions: ChatSession[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
}

export function getSessions(agentId?: AgentId): ChatSession[] {
  const all = loadAll();
  if (agentId) return all.filter((s) => s.agentId === agentId);
  return all;
}

export function getSession(sessionId: string): ChatSession | null {
  return loadAll().find((s) => s.id === sessionId) ?? null;
}

export function createSession(agentId: AgentId, title?: string): ChatSession {
  const session: ChatSession = {
    id: generateId(),
    agentId,
    title: title || '新对话',
    messages: [],
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
  const all = loadAll();
  all.unshift(session);
  saveAll(all);
  return session;
}

export function updateSession(sessionId: string, updates: Partial<Pick<ChatSession, 'title' | 'messages'>>): ChatSession | null {
  const all = loadAll();
  const idx = all.findIndex((s) => s.id === sessionId);
  if (idx === -1) return null;
  all[idx] = { ...all[idx], ...updates, updatedAt: Date.now() };
  saveAll(all);
  return all[idx];
}

export function addMessageToSession(sessionId: string, message: ChatMessage): ChatSession | null {
  const all = loadAll();
  const idx = all.findIndex((s) => s.id === sessionId);
  if (idx === -1) return null;
  all[idx].messages.push(message);
  all[idx].updatedAt = Date.now();
  // Auto-title from first user message
  if (all[idx].title === '新对话' && message.role === 'user') {
    all[idx].title = truncate(message.content, 20);
  }
  saveAll(all);
  return all[idx];
}

export function deleteSession(sessionId: string): void {
  const all = loadAll().filter((s) => s.id !== sessionId);
  saveAll(all);
}

export function clearAgentSessions(agentId: AgentId): void {
  const all = loadAll().filter((s) => s.agentId !== agentId);
  saveAll(all);
}
