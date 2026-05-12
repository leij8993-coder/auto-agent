// Agent 类型定义
export type AgentId = 'valuation' | 'customer' | 'market' | 'inspection' | 'advisor';

export interface Agent {
  id: AgentId;
  name: string;
  description: string;
  icon: string;
  color: string;
  route: string;
  systemPrompt: string;
  capabilities: string[];
}

// 消息类型
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
  metadata?: Record<string, unknown>;
}

// 对话会话
export interface ChatSession {
  id: string;
  agentId: AgentId;
  title: string;
  messages: ChatMessage[];
  createdAt: number;
  updatedAt: number;
}

// 知识库条目
export interface KnowledgeEntry {
  id: string;
  category: string;
  title: string;
  content: string;
  tags: string[];
  updatedAt: string;
}

// 车辆信息
export interface VehicleInfo {
  brand: string;
  model: string;
  year: number;
  mileage: number;
  color?: string;
  condition?: string;
}

// API 配置
export interface ApiConfig {
  provider: 'openai' | 'anthropic' | 'custom';
  apiKey: string;
  baseUrl: string;
  model: string;
}

// 系统配置
export interface SystemConfig {
  api: ApiConfig;
  maxTokens: number;
  temperature: number;
}

// Agent 状态
export interface AgentStatus {
  agentId: AgentId;
  online: boolean;
  totalSessions: number;
  lastActive: number;
}
