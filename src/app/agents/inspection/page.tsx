'use client';

import { useState } from 'react';
import ChatInterface from '@/components/ChatInterface';

const quickActions = [
  { label: '检测流程', prompt: '请告诉我二手车检测的完整流程' },
  { label: '泡水车识别', prompt: '怎么识别泡水车？有哪些关键检查点？' },
  { label: '事故车判断', prompt: '怎样判断一辆车是否出过事故？' },
];

const sections = [
  { name: '外观检测', items: 5, icon: '◈' },
  { name: '内饰检测', items: 5, icon: '◉' },
  { name: '发动机舱', items: 5, icon: '◇' },
  { name: '底盘检测', items: 5, icon: '◎' },
  { name: '路试检测', items: 5, icon: '◍' },
];

const redFlags = ['安全带日期不符', '水箱框架焊接', '后备箱地板褶皱', 'A/B/C柱漆膜异常'];

export default function InspectionPage() {
  const [sessionId, setSessionId] = useState<string | undefined>();

  return (
    <div className="flex h-screen">
      <div className="flex-1 flex flex-col">
        <ChatInterface
          agentId="inspection"
          agentName="车辆检测Agent"
          agentIcon="◎"
          agentGradient="linear-gradient(135deg, #f97316, #eab308)"
          placeholder="想了解车辆检测知识？我来帮你..."
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
                e.currentTarget.style.background = 'rgba(249, 115, 22, 0.08)';
                e.currentTarget.style.borderColor = 'rgba(249, 115, 22, 0.2)';
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

        <h3 className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider mt-6 mb-3">检测项目</h3>
        <div className="space-y-1.5">
          {sections.map((section) => (
            <div key={section.name} className="flex items-center justify-between px-3 py-2 rounded-lg" style={{ background: 'rgba(255,255,255,0.02)' }}>
              <span className="text-[12px] text-zinc-400">{section.icon} {section.name}</span>
              <span className="text-[10px] text-zinc-600">{section.items}项</span>
            </div>
          ))}
        </div>

        <h3 className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider mt-6 mb-3">红旗警示</h3>
        <div className="space-y-1.5">
          {redFlags.map((flag) => (
            <div key={flag} className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-[11px]" style={{ background: 'rgba(239, 68, 68, 0.06)', color: '#f87171' }}>
              <span className="w-1 h-1 rounded-full bg-red-400" />
              {flag}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
