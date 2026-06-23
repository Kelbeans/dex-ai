import type { PokemonCard } from "@/types/chat";

export type Segment =
  | { type: "text"; content: string }
  | { type: "card"; data: PokemonCard };

const CARD_START = "|||POKEMON_CARD|||";
const CARD_END = "|||END_CARD|||";

export function parseSegments(rawText: string): Segment[] {
  const segments: Segment[] = [];
  let remaining = rawText;

  while (remaining.length > 0) {
    const startIdx = remaining.indexOf(CARD_START);

    if (startIdx === -1) {
      // No more card delimiters — rest is text
      segments.push({ type: "text", content: remaining });
      break;
    }

    // Text before the card delimiter
    if (startIdx > 0) {
      segments.push({ type: "text", content: remaining.slice(0, startIdx) });
    }

    // Look for closing delimiter
    const afterStart = remaining.slice(startIdx + CARD_START.length);
    const endIdx = afterStart.indexOf(CARD_END);

    if (endIdx === -1) {
      // Incomplete card — treat the rest as text
      segments.push({ type: "text", content: remaining.slice(startIdx) });
      break;
    }

    // Extract JSON between delimiters
    const jsonStr = afterStart.slice(0, endIdx);

    try {
      const data = JSON.parse(jsonStr) as PokemonCard;
      segments.push({ type: "card", data });
    } catch {
      // Invalid JSON — treat the whole block as text
      segments.push({
        type: "text",
        content: remaining.slice(startIdx, startIdx + CARD_START.length + endIdx + CARD_END.length),
      });
    }

    remaining = afterStart.slice(endIdx + CARD_END.length);
  }

  return segments;
}
