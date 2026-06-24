import { SYSTEM_PROMPT } from '@/lib/system-prompt';
import { AI_TOOLS } from '@/lib/ai-tools';
import { getCachedResponse, setCachedResponse } from '@/lib/response-cache';
import {
  getPokemon,
  getPokemonForms,
  getEvolutionChain,
  getTypeEffectiveness,
  searchPokemon,
} from '@/lib/pokeapi';

export const runtime = 'nodejs';

const API_TIMEOUT_MS = 60_000;
const BEDROCK_BASE = process.env.ANTHROPIC_BASE_URL || '';
const API_KEY = process.env.ANTHROPIC_API_KEY || '';
const MODEL_ID = process.env.ANTHROPIC_MODEL || 'us.anthropic.claude-haiku-4-5-20251001-v1:0';

interface ToolUseBlock {
  type: 'tool_use';
  id: string;
  name: string;
  input: Record<string, string>;
}

interface TextBlock {
  type: 'text';
  text: string;
}

type ContentBlock = TextBlock | ToolUseBlock;

interface BedrockResponse {
  content: ContentBlock[];
  stop_reason: string;
}

async function callBedrock(messages: unknown[], tools?: unknown[]): Promise<BedrockResponse> {
  const url = `${BEDROCK_BASE}/model/${MODEL_ID}/invoke`;
  console.log(`[DexAI] Calling: ${url}`);

  const body: Record<string, unknown> = {
    anthropic_version: 'bedrock-2023-05-31',
    max_tokens: 4096,
    system: SYSTEM_PROMPT,
    messages,
  };

  if (tools && tools.length > 0) {
    body.tools = tools;
  }

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': API_KEY,
    },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(API_TIMEOUT_MS),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`[DexAI] Gateway error ${response.status}:`, errorText.slice(0, 500));
    throw new Error(`Gateway error: ${response.status} - ${errorText.slice(0, 200)}`);
  }

  const data = await response.json();
  console.log(`[DexAI] Gateway response - stop_reason: ${data.stop_reason}, content blocks: ${data.content?.length || 0}`);
  return data as BedrockResponse;
}

async function executeTool(
  name: string,
  input: Record<string, string>
): Promise<string> {
  console.log(`[DexAI] Executing tool: ${name}(${JSON.stringify(input)})`);
  try {
    switch (name) {
      case 'get_pokemon':
        return JSON.stringify(await getPokemon(input.name_or_id));
      case 'get_evolution_chain':
        return JSON.stringify(await getEvolutionChain(input.pokemon_name));
      case 'get_type_effectiveness':
        return JSON.stringify(await getTypeEffectiveness(input.type_name));
      case 'search_pokemon':
        return JSON.stringify(await searchPokemon(input.query));
      case 'get_pokemon_forms':
        return JSON.stringify(await getPokemonForms(input.pokemon_name));
      default:
        return JSON.stringify({ error: `Unknown tool: ${name}` });
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error(`[DexAI] Tool ${name} failed:`, error.message);
      if (error.message.includes('404') || error.message.includes('not found')) {
        const identifier = input.name_or_id || input.pokemon_name || input.type_name || input.query || 'unknown';
        return JSON.stringify({
          error: `Pokemon '${identifier}' not found. Please check the name and try again.`,
        });
      }
      return JSON.stringify({ error: error.message });
    }
    return JSON.stringify({ error: 'Unknown error occurred' });
  }
}

export async function POST(request: Request) {
  console.log('[DexAI] POST /api/chat - request received');

  if (!BEDROCK_BASE || !API_KEY) {
    console.error('[DexAI] Missing ANTHROPIC_BASE_URL or ANTHROPIC_API_KEY');
    return new Response(
      JSON.stringify({ error: 'API credentials not configured' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }

  let body: { messages: { role: string; content: string }[] };
  try {
    body = await request.json();
  } catch {
    return new Response(
      JSON.stringify({ error: 'Invalid request body' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  if (!body.messages || !Array.isArray(body.messages)) {
    return new Response(
      JSON.stringify({ error: 'messages array is required' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const lastUserMessage = body.messages[body.messages.length - 1]?.content || '';
  console.log(`[DexAI] Processing ${body.messages.length} message(s). Last: "${lastUserMessage.slice(0, 50)}"`);
  console.log(`[DexAI] Model: ${MODEL_ID}`);

  // Check cache for single-turn queries (first message only)
  if (body.messages.length === 1) {
    const cached = getCachedResponse(lastUserMessage);
    if (cached) {
      console.log(`[DexAI] Cache HIT for: "${lastUserMessage.slice(0, 50)}"`);
      return new Response(cached, {
        headers: { 'Content-Type': 'text/plain; charset=utf-8', 'X-Cache': 'HIT' },
      });
    }
  }

  const messages: unknown[] = body.messages.map((msg) => ({
    role: msg.role,
    content: msg.content,
  }));

  try {
    let currentMessages = [...messages];
    const MAX_TOOL_ITERATIONS = 10;

    for (let i = 0; i < MAX_TOOL_ITERATIONS; i++) {
      const response = await callBedrock(currentMessages, AI_TOOLS);

      if (response.stop_reason === 'tool_use') {
        const toolUseBlocks = response.content.filter(
          (block): block is ToolUseBlock => block.type === 'tool_use'
        );
        console.log(`[DexAI] Tool use (iteration ${i + 1}):`, toolUseBlocks.map(t => t.name).join(', '));

        currentMessages = [
          ...currentMessages,
          { role: 'assistant', content: response.content },
        ];

        const toolResults = await Promise.all(
          toolUseBlocks.map(async (toolUse) => {
            try {
              const result = await executeTool(toolUse.name, toolUse.input);
              return {
                type: 'tool_result',
                tool_use_id: toolUse.id,
                content: result,
              };
            } catch (toolError) {
              const errorMsg = toolError instanceof Error ? toolError.message : 'Tool execution failed';
              return {
                type: 'tool_result',
                tool_use_id: toolUse.id,
                content: JSON.stringify({ error: errorMsg }),
              };
            }
          })
        );

        currentMessages = [
          ...currentMessages,
          { role: 'user', content: toolResults },
        ];

        continue;
      }

      // Final text response
      const fullText = response.content
        .filter((block): block is TextBlock => block.type === 'text')
        .map((block) => block.text)
        .join('');

      console.log(`[DexAI] Response complete after ${i + 1} iteration(s). ${fullText.length} chars`);

      // Cache single-turn responses
      if (body.messages.length === 1) {
        setCachedResponse(lastUserMessage, fullText);
        console.log(`[DexAI] Cached response for: "${lastUserMessage.slice(0, 50)}"`);
      }

      return new Response(fullText, {
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
          'Cache-Control': 'no-cache',
          'X-Cache': 'MISS',
        },
      });
    }

    return new Response(
      JSON.stringify({ error: 'Too many tool iterations' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('[DexAI] Error:', error instanceof Error ? error.message : error);

    if (error instanceof Error && error.message.includes('429')) {
      return new Response(
        JSON.stringify({ error: 'Rate limited. Please wait a moment.' }),
        { status: 429, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (error instanceof Error && (error.message.includes('timed out') || error.name === 'TimeoutError')) {
      return new Response(
        JSON.stringify({ error: 'Request timed out. Please try again.' }),
        { status: 504, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const message = error instanceof Error ? error.message : 'Internal server error';
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
