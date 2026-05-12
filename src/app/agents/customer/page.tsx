'use client';

import { useState } from 'react';
import ChatInterface from '@/components/ChatInterface';

const quickActions = [
  { label: '交易流程咨询', prompt: '请介绍二手车交易的完整流程' },
  { label: '过户问题', prompt: '二手车过户需要什么材料和费用？' },
  { label: '保险咨询', prompt: '二手车应该怎么买保险？' },
];

const categories = ['交易流程', '过户手续', '保险投保', '贷款金融', '合同签订', '售后保障'];

export default function CustomerPage() {
  const [sessionId, setSessionId] = useState<string | undefined>();

  return (
    <div className="flex h-screen">
      <div className="flex-1 flex flex-col">
        <ChatInterface
          agentId="customer"
          agentName="客户服务Agent"
          agentIcon="◉"
          agentGradient="linear-gradient(135deg, #10b981, #14b8a6)"
          placeholder="有任何二手车交易问题都可以问我..."
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
                e.currentTarget.style.background = 'rgba(16, 185, 129, 0.08)';
                e.currentTarget.style.borderColor = 'rgba(16, 185, 129, 0.2)';
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

        <h3 className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider mt-6 mb-3">常见分类</h3>
        <div className="flex flex-wrap gap-1.5">
          {categories.map((cat) => (
            <span key={cat} className="px-2.5 py-1.5 rounded-lg text-[11px] text-zinc-500" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>{cat}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
