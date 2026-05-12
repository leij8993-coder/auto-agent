'use client';

import Link from 'next/link';
import type { AgentId } from '@/types';

interface AgentCard {
  id: AgentId;
  name: string;
  icon: string;
  gradient: string;
  glowColor: string;
  description: string;
  stats: { label: string; value: string }[];
  route: string;
  tag: string;
}

const agents: AgentCard[] = [
  {
    id: 'valuation',
    name: '车辆评估',
    icon: '◈',
    gradient: 'linear-gradient(135deg, #3b82f6, #06b6d4)',
    glowColor: 'rgba(59, 130, 246, 0.15)',
    description: '智能评估二手车价值，基于市场数据与车况分析',
    stats: [{ label: '今日评估', value: '23' }, { label: '准确率', value: '94%' }],
    route: '/agents/valuation',
    tag: '估值',
  },
  {
    id: 'customer',
    name: '客户服务',
    icon: '◉',
    gradient: 'linear-gradient(135deg, #10b981, #14b8a6)',
    glowColor: 'rgba(16, 185, 129, 0.15)',
    description: '自动应答客户咨询，处理买卖双方常见问题',
    stats: [{ label: '今日对话', value: '156' }, { label: '满意度', value: '92%' }],
    route: '/agents/customer',
    tag: '客服',
  },
  {
    id: 'market',
    name: '市场分析',
    icon: '◇',
    gradient: 'linear-gradient(135deg, #8b5cf6, #ec4899)',
    glowColor: 'rgba(139, 92, 246, 0.15)',
    description: '实时分析二手车市场行情，提供定价策略建议',
    stats: [{ label: '监控车型', value: '1,200+' }, { label: '数据源', value: '8' }],
    route: '/agents/market',
    tag: '分析',
  },
  {
    id: 'inspection',
    name: '车辆检测',
    icon: '◎',
    gradient: 'linear-gradient(135deg, #f97316, #eab308)',
    glowColor: 'rgba(249, 115, 22, 0.15)',
    description: '标准化检测流程，生成专业检测报告',
    stats: [{ label: '今日检测', value: '12' }, { label: '报告生成', value: '100%' }],
    route: '/agents/inspection',
    tag: '检测',
  },
  {
    id: 'advisor',
    name: '交易顾问',
    icon: '◍',
    gradient: 'linear-gradient(135deg, #f43f5e, #ec4899)',
    glowColor: 'rgba(244, 63, 94, 0.15)',
    description: '提供交易全流程指导，风险提示与合规建议',
    stats: [{ label: '今日咨询', value: '45' }, { label: '成交率', value: '38%' }],
    route: '/agents/advisor',
    tag: '顾问',
  },
];

const quickStats = [
  { label: '活跃Agent', value: '5', icon: '◆', gradient: 'linear-gradient(135deg, #6366f1, #8b5cf6)' },
  { label: '今日对话', value: '236', icon: '◇', gradient: 'linear-gradient(135deg, #3b82f6, #06b6d4)' },
  { label: '知识库条目', value: '2,847', icon: '◈', gradient: 'linear-gradient(135deg, #10b981, #14b8a6)' },
  { label: '系统运行', value: '99.9%', icon: '◉', gradient: 'linear-gradient(135deg, #f97316, #eab308)' },
];

export default function Dashboard() {
  return (
    <div className="p-8 max-w-6xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-2 h-8 rounded-full" style={{ background: 'linear-gradient(180deg, #6366f1, #8b5cf6)' }} />
          <h1 className="text-2xl font-bold text-white tracking-tight">控制台</h1>
        </div>
        <p className="text-zinc-500 text-sm ml-5">二手车业务智能Agent平台</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-4 gap-4 mb-10">
        {quickStats.map((stat, i) => (
          <div
            key={stat.label}
            className="rounded-2xl p-5 transition-all duration-300 hover:scale-[1.02] animate-slide-up group"
            style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.06)',
              animationDelay: `${i * 80}ms`,
              animationFillMode: 'both',
            }}
          >
            <div className="flex items-center justify-between mb-3">
              <p className="text-[11px] text-zinc-500 uppercase tracking-wider">{stat.label}</p>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs text-white" style={{ background: stat.gradient }}>
                {stat.icon}
              </div>
            </div>
            <p className="text-3xl font-bold text-white tracking-tight">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Agent Cards */}
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-base font-semibold text-white">Agent 状态</h2>
        <span className="text-[11px] text-zinc-600">点击进入对话</span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {agents.map((agent, i) => (
          <Link key={agent.id} href={agent.route} className="group">
            <div
              className="rounded-2xl overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-lg animate-slide-up"
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.06)',
                animationDelay: `${i * 80 + 200}ms`,
                animationFillMode: 'both',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)';
                e.currentTarget.style.boxShadow = `0 8px 32px ${agent.glowColor}`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              {/* Gradient header */}
              <div className="px-5 py-5 relative overflow-hidden" style={{ background: agent.gradient }}>
                <div className="absolute inset-0 opacity-20" style={{ background: 'radial-gradient(circle at 80% 20%, rgba(255,255,255,0.3), transparent 60%)' }} />
                <div className="relative flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center text-white text-xl font-bold" style={{ background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(10px)' }}>
                    {agent.icon}
                  </div>
                  <div>
                    <h3 className="text-white font-semibold text-sm">{agent.name}</h3>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-white/80" style={{ animation: 'pulse-soft 2s ease-in-out infinite' }} />
                      <span className="text-[10px] text-white/80">在线</span>
                    </div>
                  </div>
                  <span className="ml-auto px-2 py-0.5 rounded-md text-[10px] text-white/80 font-medium" style={{ background: 'rgba(255,255,255,0.15)' }}>
                    {agent.tag}
                  </span>
                </div>
              </div>
              {/* Card body */}
              <div className="p-5">
                <p className="text-[13px] text-zinc-400 mb-4 leading-relaxed">{agent.description}</p>
                <div className="flex gap-5">
                  {agent.stats.map((stat) => (
                    <div key={stat.label}>
                      <p className="text-[10px] text-zinc-600 uppercase tracking-wider">{stat.label}</p>
                      <p className="text-sm font-semibold text-white mt-0.5">{stat.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
