import Anthropic from '@anthropic-ai/sdk';
import type {
  MessageParam,
  ContentBlock,
  ToolResultBlockParam,
  ToolUseBlock,
} from '@anthropic-ai/sdk/resources/messages';
import { SYSTEM_PROMPT } from '@/lib/system-prompt';
import { AI_TOOLS } from '@/lib/ai-tools';
import {
  getPokemon,
  getEvolutionChain,
  getTypeEffectiveness,
  searchPokemon,
} from '@/lib/pokeapi';

export const runtime = 'nodejs';

async function executeTool(
  name: string,
  input: Record<string, string>
): Promise<string> {
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
      default:
        return JSON.stringify({ error: `Unknown tool: ${name}` });
    }
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Unknown error occurred';
    return JSON.stringify({ error: message });
  }
}

export async function POST(request: Request) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return new Response(
      JSON.stringify({ error: 'ANTHROPIC_API_KEY is not configured' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const anthropic = new Anthropic({ apiKey });

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

  // Build message history for Claude
  const messages: MessageParam[] = body.messages.map((msg) => ({
    role: msg.role as 'user' | 'assistant',
    content: msg.content,
  }));

  try {
    // Tool-use loop: call Claude, execute tools, send results back until we get a text response
    let currentMessages = [...messages];
    const MAX_TOOL_ITERATIONS = 10;

    for (let i = 0; i < MAX_TOOL_ITERATIONS; i++) {
      const response = await anthropic.messages.create({
        model: 'claude-sonnet-4-5-20250929',
        max_tokens: 4096,
        system: SYSTEM_PROMPT,
        tools: AI_TOOLS,
        messages: currentMessages,
      });

      // If Claude stopped because it wants to use tools, execute them
      if (response.stop_reason === 'tool_use') {
        const toolUseBlocks = response.content.filter(
          (block): block is ToolUseBlock => block.type === 'tool_use'
        );

        // Add Claude's response (with tool_use blocks) to the conversation
        currentMessages = [
          ...currentMessages,
          { role: 'assistant', content: response.content as ContentBlock[] },
        ];

        // Execute each tool and collect results
        const toolResults: ToolResultBlockParam[] = await Promise.all(
          toolUseBlocks.map(async (toolUse) => {
            const result = await executeTool(
              toolUse.name,
              toolUse.input as Record<string, string>
            );
            return {
              type: 'tool_result' as const,
              tool_use_id: toolUse.id,
              content: result,
            };
          })
        );

        // Add tool results to the conversation
        currentMessages = [
          ...currentMessages,
          { role: 'user', content: toolResults },
        ];

        // Continue the loop to let Claude process tool results
        continue;
      }

      // Claude gave a final response (end_turn) — stream it back to the client
      // For the final response, we re-issue the request with streaming enabled
      const stream = anthropic.messages.stream({
        model: 'claude-sonnet-4-5-20250929',
        max_tokens: 4096,
        system: SYSTEM_PROMPT,
        tools: AI_TOOLS,
        messages: currentMessages,
      });

      const readableStream = new ReadableStream({
        async start(controller) {
          const encoder = new TextEncoder();

          stream.on('text', (text) => {
            controller.enqueue(encoder.encode(text));
          });

          stream.on('error', (error) => {
            const errorMessage =
              error instanceof Error ? error.message : 'Stream error';
            controller.enqueue(
              encoder.encode(`\n[Error: ${errorMessage}]`)
            );
            controller.close();
          });

          // Wait for stream to complete
          await stream.finalMessage();
          controller.close();
        },
      });

      return new Response(readableStream, {
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
          'Transfer-Encoding': 'chunked',
          'Cache-Control': 'no-cache',
        },
      });
    }

    // If we exceeded the max tool iterations
    return new Response(
      JSON.stringify({ error: 'Too many tool iterations' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Internal server error';
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
