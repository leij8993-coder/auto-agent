'use client';

import { useState, useEffect, useCallback } from 'react';
import type { SystemConfig, AgentId } from '@/types';
import { getSystemConfig, saveSystemConfig } from '@/lib/config';
import { getSessions, deleteSession, clearAgentSessions } from '@/lib/session';
import { formatDate, formatTime, truncate } from '@/lib/utils';
import agentsData from '@/data/agents.json';

type Tab = 'api' | 'knowledge' | 'history' | 'agents';

const agentMeta: Record<AgentId, { icon: string; gradient: string }> = {
  valuation: { icon: '◈', gradient: 'linear-gradient(135deg, #3b82f6, #06b6d4)' },
  customer: { icon: '◉', gradient: 'linear-gradient(135deg, #10b981, #14b8a6)' },
  market: { icon: '◇', gradient: 'linear-gradient(135deg, #8b5cf6, #ec4899)' },
  inspection: { icon: '◎', gradient: 'linear-gradient(135deg, #f97316, #eab308)' },
  advisor: { icon: '◍', gradient: 'linear-gradient(135deg, #f43f5e, #ec4899)' },
};

export default function AdminPage() {
  const [tab, setTab] = useState<Tab>('api');
  const [config, setConfig] = useState<SystemConfig>({
    api: { provider: 'openai', apiKey: '', baseUrl: 'https://api.openai.com/v1', model: 'gpt-4' },
    maxTokens: 2048,
    temperature: 0.7,
  });
  const [saved, setSaved] = useState(false);
  const [historyAgent, setHistoryAgent] = useState<AgentId | 'all'>('all');

  useEffect(() => {
    setConfig(getSystemConfig());
  }, []);

  const refreshHistory = useCallback(() => {
    // Force re-render by using key trick
  }, []);

  function handleSave() {
    saveSystemConfig(config);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  const tabs: { id: Tab; label: string; icon: string }[] = [
    { id: 'api', label: 'API配置', icon: '◈' },
    { id: 'agents', label: 'Agent管理', icon: '◇' },
    { id: 'knowledge', label: '知识库', icon: '◉' },
    { id: 'history', label: '对话历史', icon: '◎' },
  ];

  const sessions = getSessions(historyAgent === 'all' ? undefined : historyAgent as AgentId);
  const grouped = historyAgent === 'all'
    ? Object.groupBy(sessions, (s) => s.agentId)
    : { [historyAgent]: sessions };

  return (
    <div className="p-8 max-w-5xl mx-auto animate-fade-in">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-2 h-8 rounded-full" style={{ background: 'linear-gradient(180deg, #6366f1, #8b5cf6)' }} />
          <h1 className="text-2xl font-bold text-white tracking-tight">设置</h1>
        </div>
        <p className="text-zinc-500 text-sm ml-5">系统配置与数据管理</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-8 p-1 rounded-xl w-fit" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-4 py-2 rounded-lg text-[13px] transition-all ${
              tab === t.id
                ? 'text-white'
                : 'text-zinc-500 hover:text-zinc-300'
            }`}
            style={tab === t.id ? { background: 'rgba(99, 102, 241, 0.15)' } : undefined}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* API Config */}
      {tab === 'api' && (
        <div className="max-w-2xl space-y-5">
          <div className="rounded-2xl p-6" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <h3 className="text-white font-semibold mb-4 text-sm">API 提供商</h3>
            <div className="grid grid-cols-3 gap-3 mb-5">
              {(['openai', 'anthropic', 'custom'] as const).map((p) => (
                <button
                  key={p}
                  onClick={() => setConfig({ ...config, api: { ...config.api, provider: p } })}
                  className="px-4 py-3 rounded-xl text-[13px] transition-all"
                  style={config.api.provider === p
                    ? { background: 'rgba(99, 102, 241, 0.12)', border: '1px solid rgba(99, 102, 241, 0.3)', color: '#818cf8' }
                    : { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', color: '#71717a' }
                  }
                >
                  {p === 'openai' ? 'OpenAI' : p === 'anthropic' ? 'Anthropic' : '自定义'}
                </button>
              ))}
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-[12px] text-zinc-500 mb-1.5">API Key</label>
                <input
                  type="password"
                  value={config.api.apiKey}
                  onChange={(e) => setConfig({ ...config, api: { ...config.api, apiKey: e.target.value } })}
                  placeholder="sk-..."
                  className="w-full rounded-xl px-4 py-2.5 text-[13px] text-white focus:outline-none"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
                />
              </div>
              <div>
                <label className="block text-[12px] text-zinc-500 mb-1.5">Base URL</label>
                <input
                  type="text"
                  value={config.api.baseUrl}
                  onChange={(e) => setConfig({ ...config, api: { ...config.api, baseUrl: e.target.value } })}
                  className="w-full rounded-xl px-4 py-2.5 text-[13px] text-white focus:outline-none"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
                />
              </div>
              <div>
                <label className="block text-[12px] text-zinc-500 mb-1.5">模型</label>
                <input
                  type="text"
                  value={config.api.model}
                  onChange={(e) => setConfig({ ...config, api: { ...config.api, model: e.target.value } })}
                  className="w-full rounded-xl px-4 py-2.5 text-[13px] text-white focus:outline-none"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
                />
              </div>
            </div>
          </div>

          <div className="rounded-2xl p-6" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <h3 className="text-white font-semibold mb-4 text-sm">模型参数</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[12px] text-zinc-500 mb-1.5">Max Tokens</label>
                <input
                  type="number"
                  value={config.maxTokens}
                  onChange={(e) => setConfig({ ...config, maxTokens: Number(e.target.value) })}
                  className="w-full rounded-xl px-4 py-2.5 text-[13px] text-white focus:outline-none"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
                />
              </div>
              <div>
                <label className="block text-[12px] text-zinc-500 mb-1.5">Temperature</label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="2"
                  value={config.temperature}
                  onChange={(e) => setConfig({ ...config, temperature: Number(e.target.value) })}
                  className="w-full rounded-xl px-4 py-2.5 text-[13px] text-white focus:outline-none"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
                />
              </div>
            </div>
          </div>

          <button
            onClick={handleSave}
            className="px-6 py-2.5 rounded-xl text-[13px] font-medium text-white transition-all hover:opacity-90"
            style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
          >
            {saved ? '✓ 已保存' : '保存配置'}
          </button>
        </div>
      )}

      {/* Agent Management */}
      {tab === 'agents' && (
        <div className="max-w-3xl space-y-4">
          {agentsData.map((agent) => {
            const meta = agentMeta[agent.id as AgentId];
            return (
              <div key={agent.id} className="rounded-2xl p-5" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center text-xs text-white" style={{ background: meta.gradient }}>
                      {meta.icon}
                    </div>
                    <div>
                      <h3 className="text-white font-medium text-sm">{agent.name}</h3>
                      <p className="text-[10px] text-zinc-600">/{agent.id}</p>
                    </div>
                  </div>
                  <span className="flex items-center gap-1.5 text-[11px] text-emerald-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" style={{ animation: 'pulse-soft 2s ease-in-out infinite' }} />
                    在线
                  </span>
                </div>
                <p className="text-[13px] text-zinc-400 mb-3">{agent.description}</p>
                <div className="flex flex-wrap gap-1.5">
                  {agent.capabilities.map((cap) => (
                    <span key={cap} className="px-2.5 py-1 rounded-lg text-[11px] text-zinc-500" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>{cap}</span>
                  ))}
                </div>
                <div className="mt-4 p-3 rounded-xl">
                  <p className="text-[10px] text-zinc-600 mb-1">System Prompt</p>
                  <p className="text-[12px] text-zinc-400 leading-relaxed">{agent.systemPrompt}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Knowledge Base */}
      {tab === 'knowledge' && (
        <div className="max-w-3xl space-y-3">
          {[
            { name: '车型数据库', file: 'knowledge-vehicles.json', icon: '◈', count: '15款车型', gradient: 'linear-gradient(135deg, #3b82f6, #06b6d4)' },
            { name: '市场行情', file: 'knowledge-market.json', icon: '◇', count: '趋势数据', gradient: 'linear-gradient(135deg, #8b5cf6, #ec4899)' },
            { name: '评估标准', file: 'knowledge-valuation.json', icon: '◎', count: '评估方法', gradient: 'linear-gradient(135deg, #f97316, #eab308)' },
            { name: '常见问题', file: 'knowledge-faq.json', icon: '◉', count: '10条FAQ', gradient: 'linear-gradient(135deg, #10b981, #14b8a6)' },
            { name: '政策法规', file: 'knowledge-regulations.json', icon: '◍', count: '6项法规', gradient: 'linear-gradient(135deg, #f43f5e, #ec4899)' },
            { name: '检测模板', file: 'knowledge-inspection.json', icon: '◆', count: '25项检测', gradient: 'linear-gradient(135deg, #6366f1, #8b5cf6)' },
          ].map((kb) => (
            <div key={kb.file} className="rounded-2xl p-4 flex items-center justify-between" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center text-[11px] text-white" style={{ background: kb.gradient }}>
                  {kb.icon}
                </div>
                <div>
                  <h3 className="text-white font-medium text-[13px]">{kb.name}</h3>
                  <p className="text-[10px] text-zinc-600">{kb.file} · {kb.count}</p>
                </div>
              </div>
              <span className="px-3 py-1 rounded-lg text-[11px] text-emerald-400" style={{ background: 'rgba(16, 185, 129, 0.08)' }}>已加载</span>
            </div>
          ))}
        </div>
      )}

      {/* Chat History */}
      {tab === 'history' && (
        <div className="max-w-3xl">
          {/* Filter */}
          <div className="flex gap-2 mb-5">
            <button
              onClick={() => setHistoryAgent('all')}
              className="px-3 py-1.5 rounded-lg text-[12px] transition-all"
              style={historyAgent === 'all'
                ? { background: 'rgba(99, 102, 241, 0.12)', border: '1px solid rgba(99, 102, 241, 0.3)', color: '#818cf8' }
                : { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', color: '#71717a' }
              }
            >
              全部
            </button>
            {agentsData.map((agent) => (
              <button
                key={agent.id}
                onClick={() => setHistoryAgent(agent.id as AgentId)}
                className="px-3 py-1.5 rounded-lg text-[12px] transition-all"
                style={historyAgent === agent.id
                  ? { background: 'rgba(99, 102, 241, 0.12)', border: '1px solid rgba(99, 102, 241, 0.3)', color: '#818cf8' }
                  : { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', color: '#71717a' }
                }
              >
                {agent.name}
              </button>
            ))}
          </div>

          {sessions.length === 0 ? (
            <div className="rounded-2xl p-12 text-center" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div className="w-12 h-12 rounded-2xl mx-auto flex items-center justify-center text-xl mb-4" style={{ background: 'rgba(99, 102, 241, 0.1)' }}>◎</div>
              <p className="text-zinc-400 text-sm">暂无对话历史</p>
              <p className="text-zinc-600 text-[12px] mt-1">开始使用Agent后，对话记录会自动保存</p>
            </div>
          ) : (
            <div className="space-y-2">
              {Object.entries(grouped).map(([agentId, agentSessions]) => {
                if (!agentSessions || agentSessions.length === 0) return null;
                const meta = agentMeta[agentId as AgentId];
                const agentInfo = agentsData.find((a) => a.id === agentId);
                return (
                  <div key={agentId} className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-md flex items-center justify-center text-[9px] text-white" style={{ background: meta?.gradient }}>
                          {meta?.icon}
                        </div>
                        <span className="text-[12px] text-zinc-400 font-medium">{agentInfo?.name || agentId}</span>
                        <span className="text-[10px] text-zinc-600">{agentSessions.length} 条对话</span>
                      </div>
                      <button
                        onClick={() => { clearAgentSessions(agentId as AgentId); refreshHistory(); }}
                        className="text-[10px] text-zinc-600 hover:text-red-400 transition-colors px-2 py-1 rounded"
                      >
                        清空
                      </button>
                    </div>
                    <div className="space-y-1">
                      {agentSessions.map((session) => (
                        <div
                          key={session.id}
                          className="group flex items-center justify-between px-4 py-3 rounded-xl transition-all"
                          style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)' }}
                        >
                          <div className="flex-1 min-w-0">
                            <p className="text-[13px] text-zinc-300 truncate">{session.title}</p>
                            <div className="flex items-center gap-3 mt-0.5">
                              <span className="text-[10px] text-zinc-600">{session.messages.length} 条消息</span>
                              <span className="text-[10px] text-zinc-700">{formatDate(session.updatedAt)} {formatTime(session.updatedAt)}</span>
                            </div>
                          </div>
                          <button
                            onClick={() => { deleteSession(session.id); refreshHistory(); }}
                            className="opacity-0 group-hover:opacity-100 w-6 h-6 rounded-lg flex items-center justify-center text-zinc-600 hover:text-red-400 hover:bg-red-400/10 transition-all text-xs"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
