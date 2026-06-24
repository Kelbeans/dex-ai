# DexAI

AI-powered Pokedex with a sci-fi device UI. Browse 1000+ Pokemon by generation and category, view instant stat cards with radar charts and evolution chains, or ask the AI anything in natural language.

## What It Does

- **Conversational AI Pokedex** -- Ask questions like "Tell me about Charizard", "Compare Gengar and Alakazam", or "What's super effective against Steel types?" and get rich visual responses
- **Browse Panel** -- Scroll through all 1000+ Pokemon organized by generation (I-IX) with official artwork
- **Category Filters** -- Filter by Legendary, Mythical, Mega, Gigantamax, Starter, Fossil, or Paradox Pokemon
- **Instant Detail Cards** -- Click any Pokemon to see stats (radar chart), types, abilities, evolution chain, and flavor text without waiting for AI
- **Alternate Forms** -- View Mega Evolutions, Gigantamax forms, and regional variants with their actual artwork
- **Evolution Chains** -- Visual chains with item sprites (Thunder Stone, etc.) showing evolution triggers
- **Sci-Fi Device Aesthetic** -- Dark theme, scan-line overlay, type-reactive glow, Pokemon font for names

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router, TypeScript) |
| AI | Claude (via Bedrock gateway) |
| Data | PokeAPI (free, all 1000+ Pokemon) |
| Styling | Tailwind CSS v4 + Framer Motion |
| Font | Pokemon Solid (names) + Poppins (body) |
| Storage | LocalStorage (chat history) |

## Getting Started

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.local.example .env.local
# Edit .env.local with your API credentials:
#   ANTHROPIC_BASE_URL=your_gateway_url
#   ANTHROPIC_API_KEY=your_api_key
#   ANTHROPIC_MODEL=your_model_id (optional, defaults to Haiku 4.5)

# Run development server
npm run dev
```

Open http://localhost:3000

## Features

### Browse Mode (Left Panel)
- 6-column grid with official artwork
- Generation tabs (I through IX)
- Category pills: ALL, LEGENDARY, MYTHICAL, MEGA, GMAX, STARTER, FOSSIL, PARADOX
- Search filter by name
- Click to open detail modal

### Chat Mode (Right Panel)
- Natural language queries
- Streaming AI responses
- Rich inline cards (Pokemon stats, evolution chains, type charts, forms)
- Suggested prompts on first load
- Chat history in localStorage

### Detail Modal
- Official artwork with type-colored glow
- Stat radar chart (HP, Atk, Def, SpA, SpD, Spe)
- Type badges
- Abilities (with hidden ability indicator)
- Evolution chain with item sprites
- Alternate forms section (Mega, Gmax, regional)
- "ASK DEXAI" button to send to chat

## Project Structure

```
src/
  app/
    api/
      chat/route.ts          -- AI chat endpoint (Bedrock gateway)
      pokemon/[id]/route.ts  -- Pokemon detail endpoint
      pokemon-list/route.ts  -- Generation list endpoint
    page.tsx                  -- Main page (split layout)
    layout.tsx                -- Root layout with fonts
    globals.css               -- Sci-fi theme, animations
  components/
    browse/                   -- Browse panel components
    cards/                    -- Pokemon card components (radar, types, evolution, forms)
    DeviceFrame.tsx           -- Outer sci-fi shell
    PokemonDetailModal.tsx    -- Click-to-view modal
    ChatContainer.tsx         -- Message list
    ChatInput.tsx             -- Input field
    MessageBubble.tsx         -- Message renderer with markdown
  hooks/
    useChat.ts                -- Chat state + streaming
    usePokemonDetail.ts       -- Pokemon detail fetching + cache
  lib/
    pokeapi.ts                -- PokeAPI service layer
    pokemon-categories.ts     -- Category filter data
    response-cache.ts         -- AI response caching
    system-prompt.ts          -- Claude system prompt
    ai-tools.ts               -- Tool definitions for Claude
  types/
    pokemon.ts                -- Pokemon data types
    chat.ts                   -- Chat message types
```

## Cost Optimization

- Uses Claude Haiku 4.5 (cheapest model: ~$0.001 per query)
- In-memory response cache (identical questions served instantly, no API call)
- Browse panel and detail modal use PokeAPI directly (free, no AI cost)
- AI only used for conversational queries

## License

MIT
