'use client';

import { useState } from 'react';
import ChatInterface from '@/components/ChatInterface';

const quickActions = [
  { label: '评估一辆车', prompt: '请帮我评估一辆车的价值，我提供车辆信息' },
  { label: '查询保值率', prompt: '哪些品牌的二手车保值率最高？' },
  { label: '价格对比', prompt: '帮我对比同级别车型的二手价格' },
];

const criteria = [
  { name: '品牌型号', level: '必须', color: '#3b82f6' },
  { name: '上牌年份', level: '必须', color: '#3b82f6' },
  { name: '行驶里程', level: '必须', color: '#3b82f6' },
  { name: '车况等级', level: '重要', color: '#8b5cf6' },
  { name: '过户次数', level: '参考', color: '#6366f1' },
  { name: '保养记录', level: '加分', color: '#10b981' },
];

export default function ValuationPage() {
  const [sessionId, setSessionId] = useState<string | undefined>();

  return (
    <div className="flex h-screen">
      <div className="flex-1 flex flex-col">
        <ChatInterface
          agentId="valuation"
          agentName="车辆评估Agent"
          agentIcon="◈"
          agentGradient="linear-gradient(135deg, #3b82f6, #06b6d4)"
          placeholder="输入车辆信息，我来帮你评估价值..."
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
              className="w-full text-left px-3 py-2.5 rounded-xl text-[13px] text-zinc-400 hover:text-zinc-200 transition-all group"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(59, 130, 246, 0.08)';
                e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.2)';
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

        <h3 className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider mt-6 mb-3">评估要素</h3>
        <div className="space-y-1.5">
          {criteria.map((item) => (
            <div key={item.name} className="flex items-center justify-between px-3 py-2 rounded-lg" style={{ background: 'rgba(255,255,255,0.02)' }}>
              <span className="text-[12px] text-zinc-400">{item.name}</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded-md" style={{ color: item.color, background: `${item.color}15` }}>{item.level}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
