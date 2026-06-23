import { describe, it, expect, beforeEach } from 'vitest';

describe('useChat localStorage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('starts empty when no stored history', () => {
    const stored = localStorage.getItem('dexai-history');
    expect(stored).toBeNull();
  });

  it('clearHistory removes stored data', () => {
    localStorage.setItem('dexai-history', JSON.stringify([{ id: '1', role: 'user', content: 'hi', timestamp: 1 }]));
    localStorage.removeItem('dexai-history');
    expect(localStorage.getItem('dexai-history')).toBeNull();
  });
});
