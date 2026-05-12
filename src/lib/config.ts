import type { ApiConfig, SystemConfig } from '@/types';

const DEFAULT_API_CONFIG: ApiConfig = {
  provider: 'openai',
  apiKey: '',
  baseUrl: 'https://api.openai.com/v1',
  model: 'gpt-4',
};

export function getSystemConfig(): SystemConfig {
  if (typeof window === 'undefined') return { api: DEFAULT_API_CONFIG, maxTokens: 2048, temperature: 0.7 };

  const stored = localStorage.getItem('auto_agent_config');
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      // fall through
    }
  }

  return { api: DEFAULT_API_CONFIG, maxTokens: 2048, temperature: 0.7 };
}

export function saveSystemConfig(config: SystemConfig): void {
  localStorage.setItem('auto_agent_config', JSON.stringify(config));
}

export function getApiKey(): string {
  return getSystemConfig().api.apiKey;
}
