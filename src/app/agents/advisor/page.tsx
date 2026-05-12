'use client';

import { useState } from 'react';
import ChatInterface from '@/components/ChatInterface';

const quickActions = [
  { label: '购车建议', prompt: '我是第一次买二手车，需要注意什么？' },
  { label: '合同审核', prompt: '签二手车合同要注意哪些条款？' },
  { label: '风险防范', prompt: '二手车交易有哪些常见风险？' },
];

const steps = [
  '确定需求', '筛选车辆', '实地检测', '协商价格',
  '签订合同', '办理过户', '购买保险', '完成交接',
];

const riskTips = ['确认车辆无抵押', '核实VIN码一致性', '口头承诺写入合同', '过户完成再付尾款'];

export default function AdvisorPage() {
  const [sessionId, setSessionId] = useState<string | undefined>();

  return (
    <div className="flex h-screen">
      <div className="flex-1 flex flex-col">
        <ChatInterface
          agentId="advisor"
          agentName="交易顾问Agent"
          agentIcon="◍"
          agentGradient="linear-gradient(135deg, #f43f5e, #ec4899)"
          placeholder="交易安全我来守护，有什么顾虑尽管问..."
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
                e.currentTarget.style.background = 'rgba(244, 63, 94, 0.08)';
                e.currentTarget.style.borderColor = 'rgba(244, 63, 94, 0.2)';
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

        <h3 className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider mt-6 mb-3">交易流程</h3>
        <div className="space-y-1">
          {steps.map((step, i) => (
            <div key={step} className="flex items-center gap-2.5 px-3 py-1.5">
              <span className="w-5 h-5 rounded-md flex items-center justify-center text-[9px] font-bold text-rose-400" style={{ background: 'rgba(244, 63, 94, 0.1)' }}>
                {i + 1}
              </span>
              <span className="text-[12px] text-zinc-500">{step}</span>
            </div>
          ))}
        </div>

        <h3 className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider mt-6 mb-3">风险提醒</h3>
        <div className="space-y-1.5">
          {riskTips.map((tip) => (
            <div key={tip} className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-[11px]" style={{ background: 'rgba(245, 158, 11, 0.06)', color: '#fbbf24' }}>
              <span className="w-1 h-1 rounded-full bg-amber-400" />
              {tip}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
