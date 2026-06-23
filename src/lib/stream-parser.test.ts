import { describe, it, expect } from "vitest";
import { parseSegments } from "./stream-parser";

describe("parseSegments", () => {
  it("returns plain text when no cards", () => {
    const result = parseSegments("Hello, I am DexAI.");
    expect(result).toEqual([{ type: "text", content: "Hello, I am DexAI." }]);
  });

  it("extracts a pokemon card between text", () => {
    const raw =
      'Here is Pikachu:\n|||POKEMON_CARD|||{"type":"pokemon","data":{"name":"pikachu"}}|||END_CARD|||\nPretty cool!';
    const result = parseSegments(raw);
    expect(result).toHaveLength(3);
    expect(result[0]).toEqual({ type: "text", content: "Here is Pikachu:\n" });
    expect(result[1]).toEqual({
      type: "card",
      data: { type: "pokemon", data: { name: "pikachu" } },
    });
    expect(result[2]).toEqual({ type: "text", content: "\nPretty cool!" });
  });

  it("handles incomplete card delimiter as text", () => {
    const raw = 'Loading... |||POKEMON_CARD|||{"type":"poke';
    const result = parseSegments(raw);
    expect(result[0].type).toBe("text");
  });

  it("handles multiple cards", () => {
    const raw =
      'Card 1:\n|||POKEMON_CARD|||{"type":"pokemon","data":{"name":"a"}}|||END_CARD|||\nCard 2:\n|||POKEMON_CARD|||{"type":"pokemon","data":{"name":"b"}}|||END_CARD|||';
    const result = parseSegments(raw);
    const cards = result.filter((s) => s.type === "card");
    expect(cards).toHaveLength(2);
  });

  it("handles empty text", () => {
    const result = parseSegments("");
    expect(result).toEqual([]);
  });

  it("handles card at the very start", () => {
    const raw =
      '|||POKEMON_CARD|||{"type":"pokemon","data":{"name":"bulbasaur"}}|||END_CARD|||Done.';
    const result = parseSegments(raw);
    expect(result).toHaveLength(2);
    expect(result[0]).toEqual({
      type: "card",
      data: { type: "pokemon", data: { name: "bulbasaur" } },
    });
    expect(result[1]).toEqual({ type: "text", content: "Done." });
  });

  it("treats invalid JSON inside delimiters as text", () => {
    const raw = "|||POKEMON_CARD|||{not valid json}|||END_CARD|||";
    const result = parseSegments(raw);
    expect(result).toHaveLength(1);
    expect(result[0].type).toBe("text");
  });
});
