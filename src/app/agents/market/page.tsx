'use client';

import { useState } from 'react';
import ChatInterface from '@/components/ChatInterface';

const quickActions = [
  { label: '市场行情', prompt: '当前二手车市场整体行情如何？' },
  { label: '新能源趋势', prompt: '二手新能源车市场趋势分析' },
  { label: '热门车型', prompt: '目前哪些二手车最受欢迎？' },
];

const indicators = [
  { label: '整体趋势', value: '稳中有降', color: '#eab308' },
  { label: '新能源占比', value: '38% ↑12%', color: '#10b981' },
  { label: '热门价格段', value: '5-10万 (35%)', color: '#3b82f6' },
];

export default function MarketPage() {
  const [sessionId, setSessionId] = useState<string | undefined>();

  return (
    <div className="flex h-screen">
      <div className="flex-1 flex flex-col">
        <ChatInterface
          agentId="market"
          agentName="市场分析Agent"
          agentIcon="◇"
          agentGradient="linear-gradient(135deg, #8b5cf6, #ec4899)"
          placeholder="想了解二手车市场行情？问我吧..."
          sessionId={sessionId}
          onSessionCreated={(id) => setSessionId(id)}
        />
      </div>
      <div className="w-72 overflow-y-auto p-5" style={{ borderLeft: '1px solid rgba(255,255,255,0.06)', background: 'rgba(10,10,18,0.5)' }}>
        <h3 className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider mb-3">快捷操作</h3>
        <div className="space-y-1.5">
          {quickActions.map((action) => (
            <button
              key={action.label}
              className="w-full text-left px-3 py-2.5 rounded-xl text-[13px] text-zinc-400 hover:text-zinc-200 transition-all"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(139, 92, 246, 0.08)';
                e.currentTarget.style.borderColor = 'rgba(139, 92, 246, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
              }}
              onClick={() => {
                const input = document.querySelector('textarea');
                if (input) {
                  const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, 'value')?.set;
                  nativeInputValueSetter?.call(input, action.prompt);
                  input.dispatchEvent(new Event('input', { bubbles: true }));
                  input.focus();
                }
              }}
            >
              {action.label}
            </button>
          ))}
        </div>

        <h3 className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider mt-6 mb-3">市场指标</h3>
        <div className="space-y-2">
          {indicators.map((ind) => (
            <div key={ind.label} className="rounded-xl p-3" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <p className="text-[10px] text-zinc-600 uppercase tracking-wider">{ind.label}</p>
              <p className="text-[13px] font-medium mt-0.5" style={{ color: ind.color }}>{ind.value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
