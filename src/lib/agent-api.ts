import type { ChatMessage } from '@/types';
import agentsData from '@/data/agents.json';

export function getAgentById(id: string) {
  return agentsData.find((a) => a.id === id);
}

export async function callLLM(
  systemPrompt: string,
  userMessage: string,
  history: ChatMessage[],
  config?: { api?: { apiKey?: string; baseUrl?: string; model?: string }; maxTokens?: number; temperature?: number }
): Promise<string> {
  const apiKey = config?.api?.apiKey || process.env.OPENAI_API_KEY || '';
  const baseUrl = config?.api?.baseUrl || process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1';
  const model = config?.api?.model || process.env.OPENAI_MODEL || 'gpt-4';
  const maxTokens = config?.maxTokens || 2048;
  const temperature = config?.temperature ?? 0.7;

  if (!apiKey) {
    return '⚠️ API密钥未配置。请在管理后台设置API密钥，或在环境变量中配置 OPENAI_API_KEY。';
  }

  const messages = [
    { role: 'system' as const, content: systemPrompt },
    ...history.map((m) => ({ role: m.role as 'user' | 'assistant', content: m.content })),
    { role: 'user' as const, content: userMessage },
  ];

  // 自动处理baseUrl拼接，兼容各种填法
  let endpoint = baseUrl.replace(/\/+$/, '');
  if (endpoint.endsWith('/chat/completions')) {
    // 用户已填写完整路径，直接用
  } else if (endpoint.match(/\/v\d+$/)) {
    // 以 /v1, /v4 等结尾，补上 /chat/completions
    endpoint += '/chat/completions';
  } else if (!endpoint.includes('/chat/')) {
    // 其他情况补上 /v1/chat/completions
    endpoint += '/v1/chat/completions';
  }

  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({ model, messages, max_tokens: maxTokens, temperature }),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error(`LLM API error [${res.status}]: ${endpoint}\n${errText}`);
      return `❌ API请求失败 (${res.status})\n请求地址: ${endpoint}\n请检查Base URL和模型名称是否正确。`;
    }

    const data = await res.json();
    return data.choices?.[0]?.message?.content || '未获取到回复';
  } catch (err) {
    console.error('LLM call error:', err);
    return `❌ 网络请求失败，请检查API地址是否可达。\n请求地址: ${endpoint}`;
  }
}
