import { NextRequest, NextResponse } from 'next/server';
import { getAgentById, callLLM } from '@/lib/agent-api';
import type { ChatMessage } from '@/types';

export async function POST(req: NextRequest) {
  const agent = getAgentById('customer');
  if (!agent) return NextResponse.json({ error: 'Agent not found' }, { status: 404 });

  const body = await req.json();
  const { message, history, config }: { message: string; history: ChatMessage[]; config?: Record<string, unknown> } = body;

  const reply = await callLLM(agent.systemPrompt, message, history || [], config as Parameters<typeof callLLM>[3]);
  return NextResponse.json({ reply, agentId: 'customer' });
}
